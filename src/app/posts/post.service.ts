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
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        // return [...this.posts];
        this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                   return {
                       title: post.title,
                       content: post.content,
                       id: post._id
                   };
                });
            }))
            .subscribe((transposts) => {
                this.posts = transposts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        // return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {id, title, content};
        this.http.put('http://localhost:3000/api/posts/' + id, post)
            .subscribe(response => {
                this.router.navigate(['/']);
            });
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title, content};
        this.http.post<{message: string, id: string}>('http://localhost:3000/api/posts', post)
            .subscribe((res) => {
                const id = res.id;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postid: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postid)
            .subscribe(() => {
                console.log('service dleted!');
                console.log(this.posts);
                const updatedPosts = this.posts.filter(post => post.id !== postid);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}