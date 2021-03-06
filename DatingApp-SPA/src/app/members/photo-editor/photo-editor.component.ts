import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos:Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader:FileUploader;
  hasBaseDropZoneOver=false;
  baseUrl=environment.apiUrl;
  currentMain:Photo;

  constructor(private authService:AuthService,
    private userService:UserService, private alertify:AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e:any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader=new FileUploader({
      url: this.baseUrl+ 'user/' + this.authService.decodedToken.nameid +'/photos',
      authToken:'Bearer ' + localStorage.getItem('token'),
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1023*1024
    });

    this.uploader.onAfterAddingFile=(file)=>{file.withCredentials=false;};
  
    this.uploader.onSuccessItem=(item,response,status,headers)=>{
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain

        };
        this.photos.push(photo);
        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl=photo.url;
          localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }

  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authService.decodedToken.nameid,photo.id).subscribe(()=>{
    //filtriramo slike da dobijemo onu koja je trenutno main
      this.currentMain = this.photos.filter(p=>p.isMain==true)[0];
      //postavimo je na false
      this.currentMain.isMain=false;
      //izabranu sliku stavimo da je nova main
      photo.isMain=true;

      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl=photo.url;
      localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
  }, error => {
    this.alertify.error(error);
  }); 
 }

 deletePhoto(id:number)
 {
   this.alertify.confirm('Are you sure you want to delete this photo?',()=>{
    this.userService.deletePhoto(this.authService.decodedToken.nameid,id).subscribe(()=>{
     //brisemo sliku iz niza fotografija splice(index na kome se nalazi slika, koliko zelimo da ih obrisemo)
      this.photos.splice(this.photos.findIndex(p=>p.id===id),1);
      this.alertify.success("You successfully deleted photo!");
   }  , error =>{
    this.alertify.error('Failed to delete the photo');
  });
 });
 }
}