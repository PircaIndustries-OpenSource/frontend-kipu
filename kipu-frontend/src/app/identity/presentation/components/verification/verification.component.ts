import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, AuthBannerComponent],
  templateUrl: './verification.component.html',
})

export class VerificationComponent { }
