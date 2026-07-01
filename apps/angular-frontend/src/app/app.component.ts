import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteractiveMapComponent, MapMarker } from './interactive-map/interactive-map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveMapComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans bg-gradient-mesh">
      
      <!-- Floating Header -->
      <header class="sticky top-0 z-[2000] w-full px-6 py-4 flex items-center justify-between glass border-b border-white/5 shadow-lg backdrop-blur-md">
        <div class="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="FoodBridge AI Logo" 
            className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md shadow-indigo-500/10" 
            style="width: 40px; height: 40px;"
          />
          <div>
            <h1 class="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">FoodBridge AI</h1>
            <p class="text-[10px] text-gray-500">Intelligent Logistics Engine (Angular)</p>
          </div>
        </div>

        <!-- Global Connection Badges & Role Switcher -->
        <div class="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5">
              <span [class]="'w-2 h-2 rounded-full animate-pulse ' + (backendStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500')"></span>
              <span class="text-gray-400">API: {{ backendStatus.toUpperCase() }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5">
              <span [class]="'w-2 h-2 rounded-full animate-pulse ' + (aiServiceStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500')"></span>
              <span class="text-gray-400">ML: {{ aiServiceStatus.toUpperCase() }}</span>
            </div>
          </div>

          <div class="bg-zinc-900/90 border border-white/10 p-1 rounded-full flex gap-1 text-xs">
            <button 
              (click)="setRole('landing')"
              [class]="'px-3 py-1.5 rounded-full transition-all duration-300 ' + (role === 'landing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white')"
            >
              Portal
            </button>
            <button 
              (click)="setRole('restaurant')"
              [class]="'px-3 py-1.5 rounded-full transition-all duration-300 ' + (role === 'restaurant' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white')"
            >
              Donor
            </button>
            <button 
              (click)="setRole('ngo')"
              [class]="'px-3 py-1.5 rounded-full transition-all duration-300 ' + (role === 'ngo' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white')"
            >
              NGO
            </button>
            <button 
              (click)="setRole('volunteer')"
              [class]="'px-3 py-1.5 rounded-full transition-all duration-300 ' + (role === 'volunteer' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white')"
            >
              Volunteer
            </button>
            <button 
              (click)="setRole('admin')"
              [class]="'px-3 py-1.5 rounded-full transition-all duration-300 ' + (role === 'admin' ? 'bg-zinc-800 text-white' : 'text-gray-400 hover:text-white')"
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        
        <!-- ================= LANDING PORTAL ================= -->
        <div *ngIf="role === 'landing'" class="space-y-16 animate-fadeIn">
          
          <div class="text-center max-w-3xl mx-auto space-y-6 pt-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 glow-indigo">
              ⚡ Empowering Smart Environmental Impact
            </div>
            <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Reducing Food Waste. <br/>
              <span class="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Optimized by AI.</span>
            </h1>
            <p class="text-lg text-gray-400 font-light leading-relaxed">
              FoodBridge AI orchestrates surplus redistribution using predictive analytics, real-time vehicle dispatch, and live route optimization maps.
            </p>
            <div class="flex justify-center gap-4 pt-4">
              <button 
                (click)="setRole('restaurant')"
                class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                Enter Donor Portal ➔
              </button>
              <button 
                (click)="setRole('volunteer')"
                class="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-medium border border-white/10 transition-all"
              >
                Join as Volunteer
              </button>
            </div>
          </div>

          <!-- Impact Ticker Widgets -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="glass rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
              <span class="text-xs text-gray-400 uppercase tracking-wider block mb-4">Meals Redistributed</span>
              <h3 class="text-3xl font-bold tracking-tight text-white mb-1">{{ mealsCount | number }}</h3>
              <span class="text-xs text-gray-500">meals saved</span>
            </div>
            <div class="glass rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
              <span class="text-xs text-gray-400 uppercase tracking-wider block mb-4">CO2 Footprint Prevented</span>
              <h3 class="text-3xl font-bold tracking-tight text-white mb-1">{{ co2Saved | number:'1.1-1' }} kg</h3>
              <span class="text-xs text-gray-500">emissions prevented</span>
            </div>
            <div class="glass rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
              <span class="text-xs text-gray-400 uppercase tracking-wider block mb-4">Water Footprint Offset</span>
              <h3 class="text-3xl font-bold tracking-tight text-white mb-1">{{ mealsCount * 350 | number }} L</h3>
              <span class="text-xs text-gray-500">liters conserved</span>
            </div>
            <div class="glass rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
              <span class="text-xs text-gray-400 uppercase tracking-wider block mb-4">Landfill Diverted</span>
              <h3 class="text-3xl font-bold tracking-tight text-white mb-1">{{ mealsCount * 0.45 | number:'1.0-0' }} kg</h3>
              <span class="text-xs text-gray-500">landfill reduction</span>
            </div>
          </div>

          <!-- Custom SVG Analytics charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="glass rounded-2xl p-6 border border-white/5">
              <h3 class="text-base font-bold text-white mb-1">Monthly Saved Meals</h3>
              <p class="text-xs text-gray-500 mb-6">Aggregated performance analytics over the last six months.</p>
              
              <!-- Custom Interactive CSS/SVG Graph -->
              <div class="h-[240px] flex items-end justify-between px-4 pt-4 border-b border-white/10">
                <div *ngFor="let c of chartData" class="flex flex-col items-center flex-1 group">
                  <span class="text-[9px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-all mb-1 font-bold">{{ c.meals }}</span>
                  <div class="w-8 bg-indigo-600/40 border-t border-indigo-500 hover:bg-indigo-500 rounded-t-sm transition-all" [style.height.px]="c.meals / 200"></div>
                  <span class="text-[10px] text-gray-400 mt-2">{{ c.name }}</span>
                </div>
              </div>
            </div>

            <div class="glass rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 class="text-base font-bold text-white mb-2">Sustainable Development Goals (SDGs) Aligned</h3>
              <p class="text-xs text-gray-400 leading-relaxed mb-6">
                Our machine learning matching matrix and routing logistics directly drive the United Nations sustainable food and eco directives.
              </p>
              <div class="space-y-4">
                <div class="space-y-1.5">
                  <div class="flex justify-between text-xs font-semibold">
                    <span class="text-gray-300">Goal 2: Zero Hunger</span>
                    <span class="text-emerald-400">85% Impact</span>
                  </div>
                  <div class="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div class="h-full bg-emerald-500" style="width: 85%"></div>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <div class="flex justify-between text-xs font-semibold">
                    <span class="text-gray-300">Goal 12: Responsible Consumption</span>
                    <span class="text-indigo-400">92% Impact</span>
                  </div>
                  <div class="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div class="h-full bg-indigo-500" style="width: 92%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ================= RESTAURANT (DONOR) DASHBOARD ================= -->
        <div *ngIf="role === 'restaurant'" class="space-y-8 animate-fadeIn">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 class="text-2xl font-bold text-white">Gourmet Bistro Dashboard</h2>
              <p class="text-xs text-gray-400">Manage surplus inventories, submit donations, and review CSR carbon scores.</p>
            </div>
            <button 
              (click)="showCertificate = true"
              class="px-4 py-2 bg-zinc-950 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              Export CSR Certificate
            </button>
          </div>

          <!-- AI surplus predictor widget -->
          <div class="glass rounded-2xl p-6 border border-white/5">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-emerald-500">✨</span>
              <h3 class="text-base font-bold text-white">AI Surplus Predictor</h3>
            </div>
            <form (ngSubmit)="handleAISurplusPrediction()" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 font-medium">Inventory Ingredient Volume</label>
                <input 
                  type="number" 
                  name="predInventory"
                  [(ngModel)]="predInventory"
                  class="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none" 
                />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 font-medium">Weather Forecast</label>
                <select 
                  name="predWeather"
                  [(ngModel)]="predWeather"
                  class="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option>Sunny</option>
                  <option>Rainy</option>
                  <option>Stormy</option>
                  <option>Cold</option>
                  <option>Hot</option>
                </select>
              </div>
              <div class="flex items-center gap-2 py-3">
                <input 
                  type="checkbox" 
                  name="predEvent"
                  [(ngModel)]="predEvent"
                  id="upcoming-event"
                  class="rounded bg-zinc-950 border-white/10 text-indigo-600 focus:ring-indigo-500" 
                />
                <label for="upcoming-event" class="text-xs text-gray-400 cursor-pointer">Local event/festival</label>
              </div>
              <button 
                type="submit" 
                [disabled]="predicting"
                class="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {{ predicting ? 'Running...' : 'Run Waste Prediction' }}
              </button>
            </form>

            <div *ngIf="predictionResult" class="mt-4 p-4 bg-zinc-950/80 rounded-xl border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slideUp">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-white">Predicted Surplus: <span class="text-emerald-400 font-extrabold text-lg">{{ predictionResult.predicted_surplus_kg }} kg</span></p>
                <p class="text-xs text-gray-400">{{ predictionResult.recommended_action }}</p>
              </div>
              <div class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500 uppercase tracking-widest">
                {{ predictionResult.risk_factor }}
              </div>
            </div>
          </div>

          <!-- 3 Column Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Upload surplus form -->
            <div class="glass rounded-2xl p-6 border border-white/5 space-y-6">
              <h3 class="text-base font-bold text-white">Upload Surplus Food</h3>
              
              <form (ngSubmit)="handleCreateDonation()" class="space-y-4">
                <div class="space-y-1.5">
                  <label class="text-xs text-gray-400 font-medium">Batch Title / Item Name</label>
                  <input 
                    type="text" 
                    name="newDonationTitle"
                    [(ngModel)]="newDonationTitle"
                    placeholder="Croissants, bagels, salad boxes..."
                    class="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs text-gray-400 font-medium">Category</label>
                    <select 
                      name="newDonationType"
                      [(ngModel)]="newDonationType"
                      class="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                    >
                      <option>Bakery</option>
                      <option>Cooked Meal</option>
                      <option>Dairy</option>
                      <option>Fresh Produce</option>
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs text-gray-400 font-medium">Weight (kg)</label>
                    <input 
                      type="number" 
                      name="newDonationWeight"
                      [(ngModel)]="newDonationWeight"
                      class="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs text-gray-400 font-medium block">Sample Image</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      *ngFor="let img of sampleImages"
                      type="button"
                      (click)="selectedImage = img"
                      [class]="'relative h-16 rounded-lg overflow-hidden border-2 transition-all ' + (selectedImage === img ? 'border-emerald-500 scale-[1.02]' : 'border-transparent opacity-60')"
                    >
                      <img [src]="img" class="w-full h-full object-cover" />
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all glow-emerald"
                >
                  Publish Donation Lot
                </button>
              </form>
            </div>

            <!-- Partner Map -->
            <div class="glass rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-white">Nearby Partner Map</h3>
                <p class="text-[10px] text-gray-400 leading-normal mt-1 mb-4">Centering Gourmet Bistro (D). Shows food collection hubs within 5km.</p>
              </div>
              
              <app-interactive-map 
                [center]="[40.7128, -74.0060]"
                [zoom]="13"
                [markers]="restaurantMarkers"
              ></app-interactive-map>
            </div>

            <!-- Recent Lots -->
            <div class="glass rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 class="text-base font-bold text-white">Recent Donation Lots</h3>
              <div class="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                <div *ngFor="let don of donations" class="p-3.5 bg-zinc-950/80 rounded-xl border border-white/5 flex flex-col justify-between gap-3">
                  <div class="flex gap-3 items-start">
                    <img [src]="don.imageUrl" class="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div class="space-y-0.5">
                      <h4 class="text-xs font-bold text-white">{{ don.title }}</h4>
                      <div class="flex gap-1.5 items-center text-[9px] text-gray-400">
                        <span>{{ don.weightKg }} kg</span>
                        <span>•</span>
                        <span class="text-emerald-400">{{ don.freshnessPercent }}% Fresh</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-between items-center">
                    <span [class]="'px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ' + (
                      don.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' :
                      don.status === 'MATCHED' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                    )">
                      {{ don.status }}
                    </span>
                    
                    <button
                      *ngIf="don.status === 'PENDING'"
                      (click)="triggerAIMatching(don)"
                      class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[9px] font-bold text-white flex items-center gap-1"
                    >
                      AI Match
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- ================= NGO DASHBOARD ================= -->
        <div *ngIf="role === 'ngo'" class="space-y-8 animate-fadeIn">
          <div>
            <h2 class="text-2xl font-bold text-white">Central City Food Bank Portal</h2>
            <p class="text-xs text-gray-400">Coordinate incoming donation dispatches and manage local shelter supply allocations.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 glass rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 class="text-base font-bold text-white">Nearby Pending Donation Allocations</h3>
              
              <div class="space-y-4">
                <div *ngFor="let don of pendingDonations" class="p-4 bg-zinc-950/80 rounded-xl border border-white/5 flex justify-between items-center gap-4">
                  <div>
                    <h4 class="text-sm font-bold text-white">{{ don.title }}</h4>
                    <p class="text-xs text-gray-400 mt-1">Weight: {{ don.weightKg }} kg | Freshness Score: <span class="text-emerald-500">{{ don.freshnessPercent }}%</span></p>
                  </div>
                  <button 
                    (click)="confirmMatch('org-foodbank')"
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Request Allocation
                  </button>
                </div>
              </div>
            </div>

            <!-- Resource Map -->
            <div class="glass rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-white">Local Resource Map</h3>
                <p class="text-[10px] text-gray-400 mb-4">Shows geographic locations of pending food surplus lots.</p>
              </div>
              <app-interactive-map 
                [center]="[40.7259, -73.9967]"
                [zoom]="12"
                [markers]="ngoMarkers"
              ></app-interactive-map>
            </div>
          </div>
        </div>

        <!-- ================= VOLUNTEER DASHBOARD ================= -->
        <div *ngIf="role === 'volunteer'" class="space-y-8 animate-fadeIn">
          
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 class="text-2xl font-bold text-white">Elena's Rescue Control Panel</h2>
              <p class="text-xs text-gray-400">Track dispatches, view route navigation, and verify drop-offs.</p>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl">
              <span class="text-xs font-bold text-white">Points Accrued: 650 XP</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 glass rounded-2xl p-4 border border-white/5">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-bold text-white">Real-Time Routing & Telemetry</h3>
                <button 
                  (click)="startVolunteerDeliverySimulation()"
                  [disabled]="simulatingRoute"
                  class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all"
                >
                  {{ simulatingRoute ? 'Simulation Active...' : 'Start Route Simulation' }}
                </button>
              </div>

              <app-interactive-map 
                [center]="[40.7200, -74.0000]"
                [zoom]="13"
                [markers]="volunteerMarkers"
                [routeCoords]="routeCoordinates"
              ></app-interactive-map>
            </div>

            <!-- Chat & Verification -->
            <div class="space-y-6">
              <div class="glass rounded-2xl p-5 border border-white/5 flex flex-col h-[260px] justify-between">
                <span class="text-xs font-bold text-white border-b border-white/5 pb-2 block">Live Chat</span>
                <div class="flex-1 overflow-y-auto space-y-3 pr-1 text-xs py-2">
                  <div *ngFor="let msg of simulatedChat" [class]="'p-2.5 rounded-xl ' + (msg.sender === 'Volunteer' ? 'bg-indigo-600/30 text-right ml-8 border border-indigo-500/20' : 'bg-zinc-900 mr-8 border border-white/5')">
                    <div class="font-extrabold text-[9px] text-gray-500 uppercase tracking-wider mb-1">{{ msg.sender }}</div>
                    <p class="text-gray-200">{{ msg.message }}</p>
                  </div>
                </div>
                <form (ngSubmit)="handleSendChatMessage()" class="flex gap-2 pt-2 border-t border-white/5">
                  <input 
                    type="text" 
                    name="chatInput"
                    [(ngModel)]="chatInput"
                    placeholder="Type coordination message..."
                    class="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white" 
                  />
                  <button type="submit" class="px-3 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold text-white">Send</button>
                </form>
              </div>

              <div class="glass rounded-2xl p-5 border border-white/5 space-y-3">
                <span class="text-xs font-bold text-white block">QR Code Verification Portal</span>
                <p class="text-[10px] text-gray-400 leading-normal">
                  Input drop-off verification code. Use <span class="text-amber-500 font-bold">QR_MATCHED</span> for testing.
                </p>
                <form (ngSubmit)="handleQRVerify()" class="flex gap-2">
                  <input 
                    type="text" 
                    name="qrCodeInput"
                    [(ngModel)]="qrCodeInput"
                    placeholder="Input verification code..." 
                    class="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <button type="submit" class="px-3 py-1.5 bg-emerald-600 rounded-lg text-xs font-bold text-white">Verify</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= ADMIN DASHBOARD ================= -->
        <div *ngIf="role === 'admin'" class="space-y-8 animate-fadeIn">
          <div>
            <h2 class="text-2xl font-bold text-white">Platform System Administration</h2>
            <p class="text-xs text-gray-400">Monitor blockchain auditing nodes and configure risk engines.</p>
          </div>

          <div class="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 class="text-sm font-bold text-white">Global Redistribution Map Monitor</h3>
            <app-interactive-map 
              [center]="[40.7300, -73.9800]"
              [zoom]="12"
              [markers]="adminMarkers"
            ></app-interactive-map>
          </div>
        </div>

      </main>

      <!-- Certificate Modal -->
      <div *ngIf="showCertificate" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
        <div class="glass-premium max-w-lg w-full p-8 rounded-3xl relative border border-emerald-500/30 text-center space-y-6 animate-scaleUp">
          <h3 class="text-2xl font-bold text-white">Certificate of Ecological Impact</h3>
          <p class="text-sm text-gray-300 leading-relaxed font-light">
            This digital certificate certifies that <strong>Gourmet Bistro & Cafe</strong> has successfully offset <strong>350.2 kg</strong> of Carbon Dioxide equivalent ($CO_2$) and saved <strong>140 meals</strong> from landfill deposition.
          </p>
          <button 
            (click)="showCertificate = false"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close Certificate
          </button>
        </div>
      </div>

      <!-- AI Matching Recommendation Modal -->
      <div *ngIf="matchingDonation" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
        <div class="glass max-w-lg w-full p-6 rounded-2xl relative border border-indigo-500/30 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-base font-bold text-white">AI Smart Match Heuristics</h3>
            <button (click)="matchingDonation = null" class="text-gray-500 hover:text-white text-xs">✕</button>
          </div>

          <div class="space-y-3">
            <div *ngFor="let rec of recommendations" class="p-4 bg-zinc-900 rounded-xl border border-white/10 flex justify-between items-center gap-4">
              <div>
                <span class="text-xs font-extrabold text-white block">{{ rec.ngo_name }}</span>
                <span class="text-[10px] text-emerald-400">{{ rec.distance_km }} km away</span>
              </div>
              <button 
                (click)="confirmMatch(rec.ngo_id)"
                class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
              >
                Approve Match
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer class="w-full py-6 text-center border-t border-white/5 mt-12 bg-zinc-950/80">
        <p class="text-xs text-gray-500">© 2026 FoodBridge AI Inc. All Rights Reserved. Built for Hackathons & Enterprise Scale.</p>
      </footer>

    </div>
  `
})
export class AppComponent implements OnInit {
  role: 'landing' | 'restaurant' | 'ngo' | 'volunteer' | 'admin' = 'landing';
  backendStatus: 'online' | 'offline' = 'offline';
  aiServiceStatus: 'online' | 'offline' = 'offline';

  mealsCount = 140230;
  co2Saved = 350250.4;

  // Forms
  predInventory = 35;
  predWeather = 'Rainy';
  predEvent = false;
  predictionResult: any = null;
  predicting = false;

  newDonationTitle = '';
  newDonationType = 'Bakery';
  newDonationWeight = 10;
  selectedImage = 'https://images.unsplash.com/photo-1509440159596-0249088772ff';

  // Lists
  donations: any[] = [];
  pendingDonations: any[] = [];
  leaderboard: any[] = [];
  recommendations: any[] = [];

  // Modals
  showCertificate = false;
  matchingDonation: any = null;

  // Simulation
  simulatingRoute = false;
  volunteerCoords: [number, number] = [40.7128, -74.0060];
  simulatedEta = 25;
  chatInput = '';
  qrCodeInput = '';
  simulatedChat = [
    { sender: 'NGO', message: 'Hello Elena, we are ready to receive the pasta trays when you arrive!' }
  ];

  sampleImages = [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999'
  ];

  chartData = [
    { name: 'Nov', meals: 15200 },
    { name: 'Dec', meals: 19400 },
    { name: 'Jan', meals: 23100 },
    { name: 'Feb', meals: 27900 },
    { name: 'Mar', meals: 34500 },
    { name: 'Apr', meals: 41200 }
  ];

  // Route Coordinates for simulator
  routeCoordinates: [number, number][] = [
    [40.7128, -74.0060],
    [40.7200, -74.0000],
    [40.7259, -73.9967]
  ];

  ngOnInit(): void {
    // Start Ticking
    setInterval(() => {
      this.mealsCount += Math.floor(Math.random() * 3);
      this.co2Saved += Number((Math.random() * 0.8).toFixed(2));
    }, 4500);

    this.checkConnections();
    this.loadData();
  }

  setRole(selectedRole: 'landing' | 'restaurant' | 'ngo' | 'volunteer' | 'admin'): void {
    this.role = selectedRole;
  }

  async checkConnections(): Promise<void> {
    try {
      const bRes = await fetch('http://localhost:4000/auth/users');
      if (bRes.ok) this.backendStatus = 'online';
    } catch {
      this.backendStatus = 'offline';
    }

    try {
      const aRes = await fetch('http://localhost:8000/');
      if (aRes.ok) this.aiServiceStatus = 'online';
    } catch {
      this.aiServiceStatus = 'offline';
    }
  }

  async loadData(): Promise<void> {
    try {
      const donRes = await fetch('http://localhost:4000/donations');
      if (donRes.ok) {
        this.donations = await donRes.json();
      } else {
        this.donations = this.getMockDonations();
      }
    } catch {
      this.donations = this.getMockDonations();
    }
    this.pendingDonations = this.donations.filter(d => d.status === 'PENDING');
  }

  handleAISurplusPrediction(): void {
    this.predicting = true;
    setTimeout(() => {
      this.predictionResult = {
        predicted_surplus_kg: Math.round((this.predInventory * 0.35 + (this.predWeather === 'Rainy' ? 12 : 5)) * 10) / 10,
        confidence_score: 91.2,
        recommended_action: 'Alert dispatch for early collection - High Rain forecast reduces footfalls.',
        risk_factor: this.predWeather === 'Rainy' ? 'High Waste Risk' : 'Medium Waste Risk'
      };
      this.predicting = false;
    }, 800);
  }

  handleCreateDonation(): void {
    if (!this.newDonationTitle) return;

    const localDonation = {
      id: `donation-\${Date.now()}`,
      title: this.newDonationTitle,
      foodType: this.newDonationType,
      weightKg: Number(this.newDonationWeight),
      status: 'PENDING',
      freshnessPercent: this.selectedImage.includes('pastry') ? 95.0 : 88.0,
      packagingSafety: 'Sealed',
      expirationTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      imageUrl: this.selectedImage,
    };
    
    this.donations = [localDonation, ...this.donations];
    this.pendingDonations = this.donations.filter(d => d.status === 'PENDING');
    this.newDonationTitle = '';

    import('canvas-confetti').then((conf) => conf.default());
  }

  triggerAIMatching(don: any): void {
    this.matchingDonation = don;
    this.recommendations = [
      { ngo_id: 'org-foodbank', ngo_name: 'Central City Food Bank', score: 94.5, distance_km: 2.1 },
      { ngo_id: 'org-shelter', ngo_name: 'Hope Homeless Shelter', score: 88.0, distance_km: 4.8 }
    ];
  }

  confirmMatch(ngoId: string): void {
    if (!this.matchingDonation) return;
    this.donations = this.donations.map(d => d.id === this.matchingDonation.id ? { ...d, status: 'MATCHED', recipientId: ngoId } : d);
    this.pendingDonations = this.donations.filter(d => d.status === 'PENDING');
    this.matchingDonation = null;
  }

  startVolunteerDeliverySimulation(): void {
    this.simulatingRoute = true;
    const startPoint = [40.7128, -74.0060];
    const endPoint = [40.7259, -73.9967];
    let steps = 0;
    
    const interval = setInterval(() => {
      steps++;
      const ratio = steps / 10;
      const nextLat = startPoint[0] + (endPoint[0] - startPoint[0]) * ratio;
      const nextLng = startPoint[1] + (endPoint[1] - startPoint[1]) * ratio;
      this.volunteerCoords = [nextLat, nextLng];
      this.simulatedEta = Math.max(0, 25 - steps * 2);

      if (steps === 3) {
        this.simulatedChat.push({ sender: 'System', message: 'Temperature Alert: Container stable at 4.2°C.' });
      }
      if (steps === 7) {
        this.simulatedChat.push({ sender: 'Volunteer', message: 'Traffic is light. Arriving in 5 minutes!' });
      }

      if (steps >= 10) {
        clearInterval(interval);
        this.simulatingRoute = false;
        this.simulatedChat.push({ sender: 'NGO', message: 'Perfect! Please input the QR code QR_MATCHED.' });
      }
    }, 1500);
  }

  handleQRVerify(): void {
    if (!this.qrCodeInput) return;
    if (this.qrCodeInput === 'QR_MATCHED') {
      import('canvas-confetti').then((conf) => conf.default());
      this.donations = this.donations.map(d => d.id === 'donation-2' ? { ...d, status: 'DELIVERED' } : d);
      this.qrCodeInput = '';
      this.simulatedChat.push({ sender: 'System', message: 'Offline Hand-Off Succeeded.' });
    } else {
      alert('Invalid QR details.');
    }
  }

  handleSendChatMessage(): void {
    if (!this.chatInput) return;
    this.simulatedChat.push({ sender: 'Volunteer', message: this.chatInput });
    this.chatInput = '';
  }

  // Dynamic markers list
  get restaurantMarkers(): MapMarker[] {
    return [
      { id: 'bistro', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro & Cafe (You)', type: 'donor' },
      { id: 'foodbank', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank', type: 'ngo', details: 'Capacity Available: 380kg' },
      { id: 'shelter', lat: 40.7484, lng: -73.9857, label: 'Hope Homeless Shelter', type: 'ngo', details: 'Urgency Priority Level 5' }
    ];
  }

  get ngoMarkers(): MapMarker[] {
    return [
      { id: 'ngo', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank (You)', type: 'ngo' },
      { id: 'don1', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro - Surplus Pending', type: 'donor' },
      { id: 'don2', lat: 40.7306, lng: -73.9352, label: 'Metro Grocery - Prepared Meals', type: 'donor' }
    ];
  }

  get volunteerMarkers(): MapMarker[] {
    return [
      { id: 'v-driver', lat: this.volunteerCoords[0], lng: this.volunteerCoords[1], label: 'Elena (Volunteer)', type: 'volunteer', details: `ETA: ${this.simulatedEta} mins` },
      { id: 'donor-bistro', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro & Cafe', type: 'donor' },
      { id: 'ngo-foodbank', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank', type: 'ngo' }
    ];
  }

  get adminMarkers(): MapMarker[] {
    return [
      { id: 'donor-1', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro & Cafe', type: 'donor' },
      { id: 'donor-2', lat: 40.7306, lng: -73.9352, label: 'Metro Mega Supermarket', type: 'donor' },
      { id: 'ngo-1', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank', type: 'ngo' },
      { id: 'ngo-2', lat: 40.7484, lng: -73.9857, label: 'Hope Homeless Shelter', type: 'ngo' }
    ];
  }

  private getMockDonations() {
    return [
      { id: 'donation-1', title: 'Assorted Gourmet Pastries', foodType: 'Bakery', weightKg: 12.5, status: 'DELIVERED', freshnessPercent: 95, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff' },
      { id: 'donation-2', title: 'Tomato Pasta Trays', foodType: 'Cooked Meal', weightKg: 35, status: 'MATCHED', freshnessPercent: 98, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
      { id: 'donation-3', title: 'Romaine Salad Boxes', foodType: 'Fresh Produce', weightKg: 18, status: 'PENDING', freshnessPercent: 88, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999' }
    ];
  }
}
