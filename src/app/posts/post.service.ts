import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

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

    addPost(title: string, content: string) {
        const post: Post = {id: null, title, content};
        this.http.post<{message: string, id: string}>('http://localhost:3000/api/posts', post)
            .subscribe((res) => {
                const id = res.id;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
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
