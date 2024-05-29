import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDetail } from '../interfaces/profile/profile-detail';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getAllProfiles=():Observable<ProfileDetail[]> => this.http.get<ProfileDetail[]>(`http://localhost:3000/profiles`);

  deleteProfile=(id: string)=> this.http.delete(`http://localhost:3000/profiles/${id}`);

  createProfile=(profile: ProfileDetail) => this.http.post(`http://localhost:3000/profiles/`, profile);

  editProfile=(profile: ProfileDetail) => this.http.put(`http://localhost:3000/profiles/${profile.id}`, profile);


  /*
  getAllProfiles=(userId: string):Observable<ProfileDetail[]> => this.http.get<ProfileDetail[]>(`http://localhost:5272/api/Profile/user/${userId}`);

  deleteProfile=(id: string)=> this.http.delete(`http://localhost:5272/api/Profile/delete/${id}`);

  createProfile=(profile: ProfileDetail) => this.http.post(`http://localhost:5272/api/Profile/create`, profile);

  editProfile=(profile: ProfileDetail) => this.http.put(`http://localhost:5272/api/Profile/edit/${profile.id}`, profile);
  */
}
