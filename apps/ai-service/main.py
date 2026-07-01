from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import random
import math

app = FastAPI(
    title="FoodBridge AI ML Service",
    description="Enterprise prediction, matching, and computer vision service for food redistribution",
    version="1.0.0"
)

# Enable CORS for internal monorepo communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Structures
class PredictSurplusRequest(BaseModel):
    historical_sales: List[float]
    inventory_level: float
    weather_condition: str  # Sunny, Rainy, Stormy, Cold, Hot
    upcoming_event: bool
    day_of_week: int        # 0 = Monday, 6 = Sunday

class PredictSurplusResponse(BaseModel):
    predicted_surplus_kg: float
    confidence_score: float
    recommended_action: str
    risk_factor: str

class NGOStorage(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    capacity_kg: float
    current_occupancy_kg: float
    dietary_preferences: List[str]
    urgency_level: int # 1 to 5 (5 is highest)

class SmartMatchingRequest(BaseModel):
    donor_latitude: float
    donor_longitude: float
    food_type: str
    quantity_kg: float
    dietary_tags: List[str]
    expiration_hours: float
    ngos: List[NGOStorage]

class NGOMatchScore(BaseModel):
    ngo_id: str
    ngo_name: str
    score: float  # 0 to 100
    distance_km: float
    estimated_travel_time_mins: int
    matching_reasons: List[str]

class VisionAnalysisRequest(BaseModel):
    image_url: str

class VisionAnalysisResponse(BaseModel):
    food_type: str
    freshness_percentage: float
    spoilage_detected: bool
    estimated_quantity_items: int
    packaging_safety: str # Sealed, Damaged, Exposed
    recommended_shelf_life_hours: int
    food_safety_recommendation: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str]


# Root
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "FoodBridge AI ML Engine",
        "version": "1.0.0",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# Endpoint 1: AI Surplus Prediction
@app.post("/api/v1/predict-surplus", response_model=PredictSurplusResponse)
def predict_surplus(data: PredictSurplusRequest):
    # ML Prediction Simulator
    # Calculate simple base prediction from historical sales
    if len(data.historical_sales) == 0:
        base_surplus = 15.0
    else:
        # Predict based on moving average and inventory levels
        base_surplus = (sum(data.historical_sales) / len(data.historical_sales)) * 0.12
    
    # Adjust based on inventory level
    base_surplus += data.inventory_level * 0.25

    # Adjust based on environmental factors
    weather_multiplier = 1.0
    if data.weather_condition.lower() in ["rainy", "stormy"]:
        weather_multiplier = 1.45  # Fewer footfalls = more surplus
    elif data.weather_condition.lower() in ["hot", "cold"]:
        weather_multiplier = 1.15

    event_adder = 0.0
    if data.upcoming_event:
        event_adder = 10.0  # Over-preparation for event

    # Weekday adjustments
    day_multiplier = 1.0
    if data.day_of_week in [4, 5]: # Friday, Saturday
        day_multiplier = 1.2

    predicted = max(5.0, (base_surplus * weather_multiplier * day_multiplier) + event_adder)
    predicted = round(predicted, 2)

    confidence = round(random.uniform(82.0, 96.5), 1)

    # Decisions
    if predicted > 30:
        recommended_action = "Schedule early pickup - high volume surplus predicted."
        risk_factor = "High Waste Risk"
    elif predicted > 15:
        recommended_action = "Standard matching - recommend preparing distribution list by 4 PM."
        risk_factor = "Medium Waste Risk"
    else:
        recommended_action = "Monitor shelf life. Consolidate with tomorrow's donation if stable."
        risk_factor = "Low Waste Risk"

    return PredictSurplusResponse(
        predicted_surplus_kg=predicted,
        confidence_score=confidence,
        recommended_action=recommended_action,
        risk_factor=risk_factor
    )

# Endpoint 2: AI Smart Matching
@app.post("/api/v1/smart-matching", response_model=List[NGOMatchScore])
def smart_matching(data: SmartMatchingRequest):
    scored_ngos = []
    
    # Haversine distance formula helper
    def calculate_distance(lat1, lon1, lat2, lon2):
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    for ngo in data.ngos:
        reasons = []
        distance = calculate_distance(data.donor_latitude, data.donor_longitude, ngo.latitude, ngo.longitude)
        
        # 1. Distance score (higher is better/closer)
        # Max distance benchmark: 15km
        dist_score = max(0, 100 - (distance * 6.5))
        
        # 2. Capacity score (can they accommodate the quantity?)
        available_capacity = ngo.capacity_kg - ngo.current_occupancy_kg
        if available_capacity >= data.quantity_kg:
            capacity_score = 100
            reasons.append(f"Capacity check passed: NGO has {available_capacity:.1f}kg available space.")
        else:
            # Scale down if they can only take partial
            capacity_score = max(20, (available_capacity / data.quantity_kg) * 100)
            reasons.append(f"Limited capacity: NGO can accept {available_capacity:.1f}kg out of {data.quantity_kg}kg.")

        # 3. Dietary Match
        diet_match = True
        for tag in data.dietary_tags:
            if ngo.dietary_preferences and tag not in ngo.dietary_preferences:
                diet_match = False
        
        diet_score = 100 if diet_match else 40
        if diet_match:
            reasons.append("Dietary compatibility verified.")
        else:
            reasons.append("Dietary mismatch warning - verify distribution profile.")

        # 4. Urgency
        urgency_score = ngo.urgency_level * 20
        if ngo.urgency_level >= 4:
            reasons.append("High priority matching based on active food shortages.")

        # Expiration constraints
        travel_time_mins = int(distance * 3) + 5 # 3 mins per km + 5 min loading buffer
        travel_time_hours = travel_time_mins / 60.0
        
        if travel_time_hours > data.expiration_hours:
            # Expiration risk
            final_score = 0.0
            reasons.append("EXPIRED RISK: Exceeds transit window.")
        else:
            # Weighted average
            final_score = (dist_score * 0.40) + (capacity_score * 0.25) + (diet_score * 0.15) + (urgency_score * 0.20)
            # Travel penalty adjustments
            if travel_time_hours / data.expiration_hours > 0.7:
                final_score *= 0.8
                reasons.append("Transit time warning: near food shelf-life expiration limit.")
            else:
                reasons.append(f"Fast delivery: estimated delivery within {travel_time_mins} minutes.")

        scored_ngos.append(NGOMatchScore(
            ngo_id=ngo.id,
            ngo_name=ngo.name,
            score=round(max(0.0, min(100.0, final_score)), 1),
            distance_km=round(distance, 2),
            estimated_travel_time_mins=travel_time_mins,
            matching_reasons=reasons
        ))

    # Sort by score descending
    scored_ngos.sort(key=lambda x: x.score, reverse=True)
    return scored_ngos

# Endpoint 3: Computer Vision Image Analysis
@app.post("/api/v1/computer-vision", response_model=VisionAnalysisResponse)
def computer_vision(data: VisionAnalysisRequest):
    # Simulated YOLO OCR & ResNet Freshness assessment
    url = data.image_url.lower()
    
    # Simple keyword routing based on mock URLs
    if "banana" in url or "fruit" in url:
        food_type = "Fresh Fruits"
        freshness = 85.0
        qty = 25
        packaging = "Exposed"
        shelf_life = 72
        safety = "Safe: Consume within 3 days. Keep at cool room temperature."
    elif "bread" in url or "bakery" in url:
        food_type = "Bakery & Bread"
        freshness = 90.0
        qty = 10
        packaging = "Sealed"
        shelf_life = 48
        safety = "Safe: High quality. Store in dry area."
    elif "rice" in url or "meal" in url:
        food_type = "Cooked Meal"
        freshness = 95.0
        qty = 40
        packaging = "Sealed"
        shelf_life = 12
        safety = "Urgent: Prepared hot food. Requires insulated thermal transport."
    else:
        food_type = "Assorted Groceries"
        freshness = 92.5
        qty = 15
        packaging = "Sealed"
        shelf_life = 120
        safety = "Safe: Packaged goods. Shelf-stable."

    return VisionAnalysisResponse(
        food_type=food_type,
        freshness_percentage=freshness,
        spoilage_detected=False,
        estimated_quantity_items=qty,
        packaging_safety=packaging,
        recommended_shelf_life_hours=shelf_life,
        food_safety_recommendation=safety
    )

# Endpoint 4: AI Conversational Chat Assistant
@app.post("/api/v1/chat", response_model=ChatResponse)
def ai_chat(data: ChatRequest):
    if not data.messages:
        raise HTTPException(status_code=400, detail="No message history provided")
        
    last_msg = data.messages[-1].content.lower()
    
    # Simple rule based NLP matching to emulate agent responses
    if "sandwich" in last_msg or "have" in last_msg:
        reply = "I've detected you have surplus sandwiches. We currently have 3 local shelters listing high demand for ready-to-eat meals today. I recommend scheduling an immediate pickup request for 'Shelter Hope' located 2.4 km away."
        actions = ["Schedule Donation Match", "Estimate Surplus Impact", "View Nearby Shelter Maps"]
    elif "how long" in last_msg or "safe" in last_msg or "rice" in last_msg:
        reply = "Cooked rice is safe in cold refrigeration (below 4°C/40°F) for up to 3-4 days. For warm transit, it must be kept above 60°C or transported in verified thermal containers within a maximum 2-hour window to prevent Bacillus cereus growth."
        actions = ["Check Safety Guidelines", "Register Insulated Transport", "Report Temperature Audit"]
    elif "ngo" in last_msg or "shelter" in last_msg:
        reply = "Here are the top 3 matching NGOs requesting donations right now:\n1. **Mercy Food Bank** (Distance: 1.2km) - Needs: Canned Goods, Bakery\n2. **Safe Haven Shelter** (Distance: 2.8km) - Needs: Fresh Produce, Cooked Meals\n3. **Unity Kitchen** (Distance: 4.5km) - Needs: Halal Meals, Dairy"
        actions = ["Open Map Directory", "Match All Surplus Donations"]
    else:
        reply = "Hello! I am your FoodBridge AI assistant. I can help you predict tomorrow's surplus volume, check food safety storage requirements, identify matching local food banks, or coordinate dispatch routes for drivers."
        actions = ["Predict Surplus", "Check Safety Regulations", "View Impact Dashboard"]

    return ChatResponse(
        reply=reply,
        suggested_actions=actions
    )
