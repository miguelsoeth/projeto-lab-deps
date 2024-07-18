import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDetail } from '../interfaces/profile/profile-detail';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserProfiles=(userId: string):Observable<ProfileDetail[]> => this.http.get<ProfileDetail[]>(`${this.apiUrl}Profile/user/${userId}`);

  deleteProfile=(id: string)=> this.http.delete(`${this.apiUrl}Profile/delete/${id}`);

  createProfile=(userId: string, profile: ProfileDetail) => this.http.post(`${this.apiUrl}Profile/create/${userId}`, profile);

  editProfile=(profile: ProfileDetail) => this.http.put(`${this.apiUrl}Profile/edit/${profile.id}`, profile);

  setProfileKey(name:string) {
    localStorage.setItem('selectedProfile', name);
  }

  getProfileKey(): string | null {
    return localStorage.getItem('selectedProfile');
  }

  deleteProfileKey() {
    localStorage.removeItem('selectedProfile');
  }

}
