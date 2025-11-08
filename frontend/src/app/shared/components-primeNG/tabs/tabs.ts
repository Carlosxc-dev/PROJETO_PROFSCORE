import { Component, Input } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { Image } from 'primeng/image';
import { Mapa } from '../mapa/mapa';

@Component({
  selector: 'app-tabs',
  imports: [CommonModule, TabsModule, Image, Mapa],
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.css']
})
export class Tabs {
  @Input() response: any;
}
