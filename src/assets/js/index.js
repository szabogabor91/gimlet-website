import 'alpinejs'
import 'regenerator-runtime/runtime'

export async function search() {
    console.log('Fetching..')
    let result = await fetch('/search.json');
    let docs = await result.json();
    let idx = lunr(function () {
        this.ref('id');
        this.field('title');
        this.field('url');
        this.field('content');

        docs.forEach(function (doc, idx) {
            doc.id = idx;
            this.add(doc);
        }, this);
    });
    console.log(idx)

    let results = idx.search("deploy");

	// we need to add title, url from ref
	results.forEach(r => {
		r.title = docs[r.ref].title;
		r.url = docs[r.ref].url;
	});

	console.log(results)
}
