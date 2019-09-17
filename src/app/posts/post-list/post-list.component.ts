import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     {title: 'First Post', content: 'This is the first post content'},
    //     { title: 'Second Post', content: 'This is the second post content' },
    //     { title: 'Third Post', content: 'This is the third post content' }
    // ];
    posts: Post[] = [];
    private postsSub: Subscription;

    constructor(public postService: PostService) {}

    ngOnInit() {
        this.postService.getPosts();
        this.postsSub = this.postService.getPostUpdatedListener()
        .subscribe((posts: Post[]) => {
            console.log(posts);
            this.posts = posts;
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }

    onDelete(postid: string) {
        console.log('ddd');
        this.postService.deletePost(postid);
    }
}
