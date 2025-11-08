import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Panel } from "primeng/panel";
import { AuthenticateService } from '../../../auth-module/services/authenticate/service-authenticate';

@Component({
  selector: 'app-welcome',
  imports: [ImageModule, Panel],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome {
	constructor(
		private  authenticateService: AuthenticateService
	) {
		this.nameUser = this.authenticateService.getCurrentUser()?.name || 'Usuario';
	}

	nameUser: string = '';


}
