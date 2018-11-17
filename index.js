const fs = require('fs');
const async = require('async');
const TFIDF = require('./TFIDF');

const files = ['file1.txt', 'file2.txt'];
const tfidf = new TFIDF();

class Docmap {
    constructor(docname){
        this.docname = docname;
        this.map = [];
    }
    add(tuple){
        this.map.push(tuple);
    }
    json(){
        return JSON.stringify(this);
    }
}

const keywords = (file, files) => {
    async.map(files, fs.readFile, function(err, _files) {
        if(err) throw err;
        
        const i = files.indexOf(file) || 0;
        const contents = _files[i].toString();
        tfidf.termFreq(contents);

        _files.forEach(file => {
            tfidf.docFreq(file.toString());
        });

        tfidf.finish(_files.length);
        tfidf.sortByScore();

        const docmap = new Docmap(file);
        tfidf.getKeys().forEach(key => {
            if(tfidf.getScore(key) !== 0)
                docmap.add({key, score: tfidf.getScore(key)});
        })
        console.log(docmap.json());
    });
};

keywords('file2.txt', files);