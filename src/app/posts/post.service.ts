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
                       id: post._id,
                       imagePath: post.imagePath
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
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', fData)
            .subscribe((res) => {
                const post: Post = {
                    id: res.post.id,
                    title: res.post.title,
                    content: res.post.content,
                    imagePath: res.post.imagePath};
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
