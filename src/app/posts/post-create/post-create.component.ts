import { Component } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    constructor(public postsService: PostService) {}

    onAddPost(a: NgForm) {
        if (a.invalid) { return; }
        this.postsService.addPost(a.value.title, a.value.content);
        a.resetForm();
    }
}
