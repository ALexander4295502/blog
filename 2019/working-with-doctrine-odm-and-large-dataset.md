---
title: Working with doctrine ODM and large dataset
author: Zheng Yuan
date: 10/13/2019
tags: ['php', 'mongodb', 'doctrine', 'ODM', 'backend']
---

Working with doctrine ODM and large dataset
============

When I was working on my school project, I never be worried about some memory issue when doing the backend task since the data I operated on was very small, and I never consider any space issue in the service API build up.

Later on, when I has a chance to touch the enormous dataset in my work, I began to relize the memory is not always big enough to handle your data CRUD operation, especially in **PHP**. 

From the php doc
> the garbage collection mechanism is to reduce memory usage by cleaning up circular-referenced variables as soon as the prerequisites are fulfilled. 

which means we don't need to worry about the memory leak in most cases since the gc will help us to freed the circular-referenced variables and other unused variables after the function completes and in most cases the gc collection will have no performance hit on our program at all.

So the reason I reached the memory limit is not that the php forget the gc but we don't give the php a good sign to start the gc.

By default doctrine ODM will always fetch the documents from database and make them hydrated. and if you want to get the result of query, you have to iterate over the result:

~~~php
$result = $dao->findAll($criteria);
foreach($result as $item) {

    // do whatever you want with current item during iteration

}
~~~

So in this case if you call the `get_memory_usage()` you will notice that the foreach loop will not always increase the memory, instead, it will only increase by the size of the item and after loop finished, it will go by to normal.

This is because the doctrine will never turn the iterator to array at once when we want to go through them. 

But just like I mentioned above, as you iterate, the doctrine will keep each of item with `UnitOfWork` which is responsible for tracking changes to objects during an "object-level" transaction and for writing out changes to the database in the correct order. As a result, although you might don't do any change on these documents, the memory used during the iteration will keep increasing until the iteration finished or it reached the memory limit and throw an exception.

Fortunately, doctrine has a API to help us release the memory if you finished the job with current document and will never touch it again, in this case you can do it like:
~~~php
$result = $dao->findAll($criteria);
foreach($result as $item) {

    // do whatever you want with current item during iteration

    // say good bye to memory oversize
    $dao->getDocumentManager()->detach($item);

}
~~~

By calling `detach()` we will let the document manager detach the document and **unflush all the changes that haven't been flushed to DB**. After that any reference variable related will be freed sooner or later by the php garbage collector.

Also there is another way to walk around this problem. Since the doctrine keep the `UnitOfWork` only for the object-level changes, if you tell doctrine not to give you the hydrated result of the query, the `UnitOfWork` will never be created.

~~~php
$result = $dao->findAll(
    $criteria, 
    $return_as_hydrated = false // using param flag to prevent hydration
);
foreach($result as $item) {

    // do whatever you want with current item during iteration
    // and never be worried about the memory oversize

}
~~~

In this case, the doctrine will never track the object-level transaction and php will release the memory of the `$item` once it has been iterated over. 
