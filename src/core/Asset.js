export default class Asset {

    constructor(game) {

        this.game = game;
        
        this.loadedFiles = 0;
        
        this.toLoad = new Map();
        this.image = {};
        this.audio = {};

    }

    loadImage(id, url) {

        if (this.image.hasOwnProperty(id))
            return this;
        
        this.toLoad.set(id, new File('image', id, url));
        return this;

    }

    loadAudio(id, url) {

        if (this.audio.hasOwnProperty(id))
            return this;

        this.toLoad.set(id, new File('audio', id, url));
        return this;

    }

    // private
    startLoad() {

        for (let file of this.toLoad.values()) {

            switch (file.type) {
            case 'image':
                let img = new Image();
                img.src = file.url;
                img.assetId = file.id;
                img.addEventListener('load', loadHanlder.bind(this));
                break;

            case 'audio':
                let aud = new Audio(file.url);
                aud.assetId = file.id;
                aud.addEventListener('load', loadHanlder.bind(this));
                aud.dispatchEvent(new Event('load'));
                break;

            }

        }

    }

    get totalFiles() {
        return this.toLoad.size;
    }
    
    get progressAsPercent() {
        return (this.loadingFiles === 0) ? 0 : this.loadedFiles / this.totalFiles * 100;
    }

}


const loadHanlder = function(event) {

    event.target.removeEventListener('load', loadHanlder);
    
    const file = this.toLoad.get(event.target.assetId);
    
    this[file.type][file.id] = event.target;
    this.loadedFiles++;
    
    if(this.loadedFiles === this.totalFiles) {
        document.dispatchEvent(new CustomEvent('preloaded'));
        this.toLoad.clear();
        this.loadedFiles = 0;
    }

}


class File {

    constructor(type, id, url) {

        this.type = type;
        this.id = id;
        this.url = url;

    }

}