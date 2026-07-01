import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: 'donor' | 'ngo' | 'volunteer';
  details?: string;
}

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-inner">
      <div #mapContainer class="w-full h-full"></div>
      <div class="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] flex gap-3.5 z-[1000]">
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Donor</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
          <span>NGO</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-amber-500 inline-block animate-bounce"></span>
          <span>Volunteer</span>
        </div>
      </div>
    </div>
  `
})
export class InteractiveMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  @Input() center: [number, number] = [40.7200, -74.0000];
  @Input() zoom: number = 13;
  @Input() markers: MapMarker[] = [];
  @Input() routeCoords: [number, number][] = [];

  private mapInstance: any;
  private plottedMarkers: { [id: string]: any } = {};
  private routePolyline: any;
  private L: any;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    // Dynamically load Leaflet on the client side
    import('leaflet').then((leaflet) => {
      this.L = leaflet;
      this.initializeMap();
    });
  }

  private initializeMap(): void {
    if (!this.mapContainer || this.mapInstance) return;

    const L = this.L;

    // Create map centered on coordinate
    this.mapInstance = L.map(this.mapContainer.nativeElement).setView(this.center, this.zoom);

    // Add CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 20,
    }).addTo(this.mapInstance);

    // Plot route polyline if coordinates exist
    if (this.routeCoords && this.routeCoords.length > 0) {
      this.routePolyline = L.polyline(this.routeCoords, {
        color: '#6366f1',
        weight: 4,
        opacity: 0.6,
        dashArray: '5, 10',
      }).addTo(this.mapInstance);
    }

    // Plot initial markers
    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.mapInstance || !this.L) return;

    const L = this.L;

    // Clear existing markers
    Object.values(this.plottedMarkers).forEach((marker) => {
      this.mapInstance.removeLayer(marker);
    });
    this.plottedMarkers = {};

    // Plot new markers
    this.markers.forEach((m) => {
      let htmlClass = '';
      let labelChar = 'M';
      
      if (m.type === 'donor') {
        htmlClass = 'bg-emerald-500 glow-emerald';
        labelChar = 'D';
      } else if (m.type === 'ngo') {
        htmlClass = 'bg-indigo-500 glow-indigo';
        labelChar = 'N';
      } else {
        htmlClass = 'bg-amber-500 animate-bounce';
        labelChar = 'V';
      }

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-xs font-extrabold ${
          m.type === 'volunteer' ? 'text-black' : 'text-white'
        } ${htmlClass}">${labelChar}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([m.lat, m.lng], { icon })
        .addTo(this.mapInstance)
        .bindPopup(`<b>${m.label}</b>${m.details ? `<br/>${m.details}` : ''}`);

      this.plottedMarkers[m.id] = marker;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && !changes['markers'].firstChange) {
      this.updateMarkers();
      
      // Pan to volunteer if active location updates
      const volunteer = this.markers.find(m => m.type === 'volunteer');
      if (volunteer && this.mapInstance) {
        this.mapInstance.panTo([volunteer.lat, volunteer.lng]);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }
}
