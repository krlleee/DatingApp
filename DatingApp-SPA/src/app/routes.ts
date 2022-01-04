import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ListsComponent } from "./lists/lists.component";
import { MemberListComponent } from "./member-list/member-list.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";

export const appRoutes: Routes=[

    {path: '', component:HomeComponent},

    //zastita vise ruti
    {
        path:'',
        runGuardsAndResolvers:'always',
        canActivate:[AuthGuard],
        children:[
            {path: 'members', component: MemberListComponent,},
            {path: 'messages', component:MessagesComponent},
            {path: 'lists', component:ListsComponent},
        ]
    },
   
    //ako se ne poklapa ni sa jednom od gore redirektovace na home
    //bitan je redosled jer ce se redom proveravati rute i ako nema poklapanja koristi se "wildcard"
    //ako bi ona bila prva ne bi mogli doci ni do jedne druge jer bi ona bila stalno zadovoljena
    {path: '**', redirectTo:'',pathMatch:'full'}
    
];
