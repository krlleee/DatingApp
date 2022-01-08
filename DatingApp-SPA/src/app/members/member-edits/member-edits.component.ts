import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edits',
  templateUrl: './member-edits.component.html',
  styleUrls: ['./member-edits.component.css']
})
export class MemberEditsComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm;
  user:User;
  photoUrl:string;
  //ako prilikom promene podataka pre sacuvavanja korisnik ugasi browser
  //iskace mu obavestenje da li je siguran da oce da zatvori
  @HostListener('window:beforeunload',['$event'])
  unloadNotification($event:any){
    if(this.editForm.dirty)
    {
      $event.returnValue=true;
    }
  }
  

  constructor(private route:ActivatedRoute,
    private alertify:AlertifyService,private userService:UserService,
    private authService:AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.user=data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl);
  }

  updateUser(){
    this.userService.updateUser(this.authService.decodedToken.nameid,this.user).subscribe(next=>{
      this.alertify.success('Profile updated successfully');
    this.editForm.reset(this.user);
    },error=>{
      this.alertify.error(error);
    });

  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl=photoUrl;
  }

}
