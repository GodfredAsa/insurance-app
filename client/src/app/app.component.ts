import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Insurance Project</h1>
        <p class="text-gray-600">Angular + Tailwind CSS</p>
        <router-outlet />
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {}
