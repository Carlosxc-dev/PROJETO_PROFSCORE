import { Component } from '@angular/core';
import { Panel } from 'primeng/panel';
import { Accordion } from '../../../../../shared/components-primeNG/accordion/accordion';


@Component({
  selector: 'app-help',
  imports: [Accordion, Panel],
  templateUrl: './help.html',
  styleUrl: './help.css'
})
export class Help {

}
