import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { MemberEditsComponent } from "../members/member-edits/member-edits.component";

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditsComponent>{
    canDeactivate(component: MemberEditsComponent) {
        if(component.editForm.dirty){
            return confirm('Are you sure you want to continue? Any unsaved changes will be lost!');
        }
        return true;
    }
}