import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { post } from 'selenium-webdriver/http';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    private mode = 'create';
    private id: string;
    post: Post;
    isLoading = false;
    constructor(public postsService: PostService, public route: ActivatedRoute) {}


    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('id')) {
                this.mode = 'edit';
                this.id = paramMap.get('id');
                this.isLoading = true;
                this.postsService.getPost(this.id).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {id: postData._id, title: postData.title, content: postData.content};
                });
            } else {
                this.mode = 'create';
                this.id = null;
            }
        });
    }

    onSavePost(a: NgForm) {
        if (a.invalid) { return; }
        this.isLoading = true;
        if (this.mode === 'create' ) {
            this.postsService.addPost(a.value.title, a.value.content);
        } else {
            this.postsService.updatePost(this.id, a.value.title, a.value.content);
        }
        a.resetForm();
    }
}
