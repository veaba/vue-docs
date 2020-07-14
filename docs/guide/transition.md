## Vue-next transition

### todo transition生成dom时候需要忽略注释，现在是警告

- 把注释挪动下就可以了

```txt
vue.esm.js:4745 [Vue warn]: Template compilation error: <Transition> expects exactly one child element or component.
6  |      </div>
7  |      <transition name="slide">
8  |        <!--
   |        ^^^^
9  |          giving the post container a unique key triggers transitions
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
10 |          when the post id changes.
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
11 |        -->
   |  ^^^^^^^^^
12 |        <div v-if="post" class="content" :key="post.id">
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
13 |          <h2>{{ post.title }}</h2>
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
14 |          <p>{{ post.body }}</p>
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
15 |        </div>
   |  ^^^^^^^^^^^^ 
  at <Anonymous class="view view" >  
  at <RouterView class="view" >  
  at <Anonymous> (Root)
```
