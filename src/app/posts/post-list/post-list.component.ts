import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material';

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
    isLoading = false;
    totalPosts = 10;
    postPerPage = 1;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    private postsSub: Subscription;

    constructor(public postService: PostService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postService.getPosts(this.postPerPage, this.currentPage);
        this.postsSub = this.postService.getPostUpdatedListener()
        .subscribe((posts: Post[]) => {
            console.log(posts);
            this.isLoading = false;
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

    onChangePage(pageData: PageEvent) {
        console.log(pageData);
        this.currentPage = pageData.pageIndex + 1;
        this.postPerPage = pageData.pageSize;
        this.postService.getPosts(this.postPerPage, this.currentPage);
    }
}
