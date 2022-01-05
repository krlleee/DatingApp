import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ListsComponent } from "./lists/lists.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MemberDetailResolver } from "./_resolvers/member-detail.resolver";
import { MemberListResolver } from "./_resolvers/member-list.resolver";

export const appRoutes: Routes=[

    {path: '', component:HomeComponent},

    //zastita vise ruti
    {
        path:'',
        runGuardsAndResolvers:'always',
        canActivate:[AuthGuard],
        children:[
            {path: 'members', component: MemberListComponent,resolve:{users:MemberListResolver}},
            {path: 'members/:id', component: MemberDetailComponent,resolve:{user:MemberDetailResolver}},
            {path: 'messages', component:MessagesComponent},
            {path: 'lists', component:ListsComponent},
        ]
    },
   
    //ako se ne poklapa ni sa jednom od gore redirektovace na home
    //bitan je redosled jer ce se redom proveravati rute i ako nema poklapanja koristi se "wildcard"
    //ako bi ona bila prva ne bi mogli doci ni do jedne druge jer bi ona bila stalno zadovoljena
    {path: '**', redirectTo:'',pathMatch:'full'}
    
];
