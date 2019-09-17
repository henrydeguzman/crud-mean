import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

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
    form: FormGroup;
    constructor(public postsService: PostService, public route: ActivatedRoute) {}


    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]})
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('id')) {
                this.mode = 'edit';
                this.id = paramMap.get('id');
                this.isLoading = true;
                this.postsService.getPost(this.id).subscribe(postData => {
                    this.isLoading = false;
                    this.post = {id: postData._id, title: postData.title, content: postData.content};
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content
                    });
                });
            } else {
                this.mode = 'create';
                this.id = null;
            }
        });
    }

    onSavePost() {
        if (this.form.invalid) { return; }
        this.isLoading = true;
        if (this.mode === 'create' ) {
            this.postsService.addPost(this.form.value.title, this.form.value.content);
        } else {
            this.postsService.updatePost(this.id, this.form.value.title, this.form.value.content);
        }
        this.form.reset();
    }
}
