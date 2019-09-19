import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        // return [...this.posts];
        this.http.get<{message: string, posts: any, count: number }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map((postData) => {
                return {posts: postData.posts.map(post => {
                   return {
                       title: post.title,
                       content: post.content,
                       id: post._id,
                       imagePath: post.imagePath
                   };
                }), count: postData.count};
            }))
            .subscribe((transposts) => {
                this.posts = transposts.posts;
                this.postsUpdated.next({ posts: [...this.posts], postCount: transposts.count});
            });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        // return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        // const post: Post = {id, title, content, imagePath: null};
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image);
        } else {
            postData = { id, title, content, imagePath: image };
        }
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe(response => {
                this.router.navigate(['/']);
            });
    }

    addPost(title: string, content: string, image: File) {
        // const post: Post = {id: null, title, content};
        const fData = new FormData();
        fData.append('title', title);
        fData.append('content', content);
        fData.append('image', image, title);
        this.http.post<{message: string, post: Post, count: number}>('http://localhost:3000/api/posts', fData)
            .subscribe((res) => {
                this.router.navigate(['/']);
            });
    }

    deletePost(postid: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postid);
    }
}
