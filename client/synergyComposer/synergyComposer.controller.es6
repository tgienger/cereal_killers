/**
*  Creating a new Post
*/
class Post {
    constructor() {
        this.markdown = '';
        this.subject = '';
        // this.topic = topic;
    }
}


/**
 * Creating the editor class
 * TODO: Make the editor
 */
// class EditorView {
//     constructor() {
//         this.urlCount = 0;
//         this.memory = [];
//         this.memoryMaxSize = 1000;
//         this.stopTime = 250;
//     }
//
//     enterText(str) {
//         this.memory.push(str);
//         if (this.memory.length > this.memoryMaxSize) {
//             this.memory = this.memory.slice(this.memory.length - this.memoryMaxSize - 1, this.memory.length);
//         }
//     }
//
// }

/**
 * Creating a new mod (example: **bold**) within the textarea.
 */
class Mod {
    constructor(mod, cb) {
        this.mod = mod;

        this.mods = new Map([
            ['bold', '**SAMPLE**'],
            ['italic', '*SAMPLE*'],
            ['link', '[SAMPLE](SAMPLE)'],
            ['code', '```\nSAMPLE\n```'],
            ['quote', '<blockquote>SAMPLE</blockquote>'],
            ['ul', '- SAMPLE'],
            ['ol', '1. SAMPLE']
        ]);

        this.el = document.getElementById('synergy-composer');
        this.currentMod = undefined;
        this.modded = false;
        this.link = this.mod === this.mods.get('link');
        this.selected = this.getSelection();

        // this.init(cb);
    }

    /**
     * Tests string for markdown modifications
     */
    test() {
        if (this.selected.text) {
            var pattern = new RegExp('SAMPLE', 'g');
            var testArray = [];
            var index = -1;
            var foundMod;
            var modded = false;

            // replaces new array's 'SAMPLE' with the currently
            // selected text for testing.
            // mods.forEach(function(d) {
            //     testArray.push(d.replace(pattern, this.selected.text));
            // });
            [for (i of this.mods.values()) testArray.push(i.replace(pattern, this.selected.text))]
            var length = testArray.length;

            // Searches for a matching markdown, if found sets
            // currentMod variable to the discovered md.
            while (++index < length) {
                var mIndex = testArray[index].indexOf(this.selected.text);
                var modStart = testArray[index].slice(0, mIndex);
                var doesStart = this.el.value.slice(0, this.selected.start).endsWith(modStart);
                if (doesStart) {
                    foundMod = testArray[index];
                    break;
                }
            }

            // this.mod = this.mod.replace(/SAMPLE/g, this.selected.text);
            this.mod = this.mod.replace(/SAMPLE/g, this.selected.text);
            // mod.set('mod', this.mod.replace(/SAMPLE/g, this.selected.text));

            if (foundMod && foundMod === this.mod) {
                // modded = true;
                // mod.set('modded', true);
                this.modded = true;
                this.currentMod = foundMod;
            } else {
                // modded = false;
                // mod.set('modded', false);
                this.modded = false;
                this.currentMod = undefined;
            }
        } else {
                // modded = false;
                // mod.set('modded', false);
                this.modded = false;
                this.currentMod = undefined;
                return false;
        }

        return this.modded;
    };



    getSelection() {
        var textComponent = this.el,
            sel,
            startPos,
            endPos;

        function setSelected(start, end, text) {
            return {
                start: start,
                end: end,
                text: text
            };
        }
        // IE version
        if (document.selection !== undefined) {
            textComponent.focus();
            sel = document.selection.createRange();
            var selectedText = sel.text;
        } else if (textComponent.selectionStart !== undefined) {
            startPos = textComponent.selectionStart;
            endPos = textComponent.selectionEnd;
            selectedText = textComponent.value.substring(startPos, endPos);
        }
        return setSelected(startPos, endPos, selectedText);
    }


    /**
     * removes markdown modification
     */
    unMod(cb) {
        var newText = this.selected.text;
        var oldText = this.currentMod;
        var modFront = this.selected.start - oldText.indexOf(newText);
        var modBack = modFront + oldText.length;
        this.el.value = this.el.value.slice(0, modFront) + this.selected.text + this.el.value.slice(modBack);
        this.modded = false;
        (cb || angular.noop);
    }

    /**
     * Once modification is complete, re-select text
     * between the markdown modifiers
     */
    selectIt() {
        var index = 1,
            text,
            modIndex,
            modLength;
        text = this.selected.text;
        modIndex = this.mod.indexOf(text);
        modLength = this.mod.slice(0, modIndex).length;
        var modEnd = this.mod.slice(modIndex + text.length, this.mod.length);
        if (this.modded) {
            index = this.selected.start + modLength;
        } else {
            index = this.selected.start - modLength;
        }
        this.el.focus();
        // el.selectionStart = index;
        // el.selectionEnd = selected.text.length + index;
        var ending = this.selected.text.length + index;
        this.setSelectionRange(this.el, index, ending);
    }


    /**
     * Sets the selection within the textarea, set starting and ending point
     * to same location for caret placement.
     * @param {Object} input          Your text input/textarea
     * @param {number} selectionStart starting point of your selection
     * @param {number} selectionEnd   ending point of your selection
     */
    setSelectionRange(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }


    setText(txt) {
        this.el.value = txt;
        this.modded = true;
    }


    /**
     * adds markdown modification
     */
    addMod(cb) {

        var http,
            position = 0,
            reg = new RegExp(this.selected.text, 'g');

        if (this.link === true) {
            sweetAlert({
                title: '',
                text: 'Enter Your Link URL',
                type: 'input',
                showCancelButton: true,
                animation: 'slide-from-top'
            }, (inputValue) => {
                if (inputValue === '') {
                    swal.showInputError('No URL Entered');
                    return false;
                }
                if (inputValue === false) {
                    return false;
                }

                if (inputValue.startsWith('http://') || inputValue.startsWith('https://')) {
                    http = inputValue;
                } else {
                    http = 'http://' + inputValue;
                }

                this.mod = this.mod.replace(reg, function(match) {
                    position++;
                    return (position === 2) ? http : match;
                });

                this.setText(this.el.value.slice(0, this.selected.start) + this.mod + this.el.value.slice(this.selected.end));
                this.selectIt();
                (cb || angular.noop)();
            });
        } else {
            this.mod = this.mod.replace(reg, this.selected.text);
            this.setText(this.el.value.slice(0, this.selected.start) + this.mod + this.el.value.slice(this.selected.end));
        }
        (cb || angular.noop)();
    }




    /**
     * If no text is selected, send in the default text 'placeholder text'
     */
    noSelect(cb) {
        this.selected.text = 'placeholder text';
        // mod.set('mod', this.mod.replace(/SAMPLE/g, this.selected.text));
        this.mod = this.mod.replace(/SAMPLE/g, this.selected.text);
        this.addMod(cb);
    }

    init(cb) {
        if (this.selected.text) {
            if (this.test()) {
                if (this.link) {

                } else {
                    this.unMod(cb);
                    this.selectIt();
                    // (cb || angular.noop)();
                }
            } else {
                this.addMod(cb);
                this.selectIt();
                // (cb || angular.noop)();
            }
        } else {
            this.noSelect(cb);
            this.selectIt();
            // (cb || angular.noop)();
        }
    }
}

class SynergyComposerController {
    // TODO: Mods Toolbar

    static $inject = ['$scope'];
    constructor($scope) {

        // this.topic = '';
        this.reply = false;
        this.edited = undefined;
        this.collapse = true;
        this.previewToggle = false;

        this.post = {
            subject: '',
            markdown: ''
        };

        this.topics = [];


        if (typeof String.prototype.startsWith != 'function') {
            // see below for better implementation!
            String.prototype.startsWith = function (str){
                return this.indexOf(str) === 0;
            };
        }


        this.mods = new Map([
            ['bold', '**SAMPLE**'],
            ['italic', '*SAMPLE*'],
            ['link', '[SAMPLE](SAMPLE)'],
            ['code', '```\nSAMPLE\n```'],
            ['quote', '<blockquote>SAMPLE</blockquote>'],
            ['ul', '- SAMPLE'],
            ['ol', '1. SAMPLE']
        ]);

        this.el = document.getElementById('synergy-composer');
    }

    // Set the markdown
    setMarkdown() {
        this.post.markdown = this.el.value;
    }



    modTest() {
        if (this.selected) {
            var pattern = new RegExp('SAMPLE', 'g');
            var testArray = [];
            var index = -1;
            var foundMod;
        }
    }


    open(post, cb) {

        this.post = post || new Post();

        this.collapse = false;

        (cb || angular.noop)();
        return this;
    }

    close(cb) {
        this.collapse = true;
        (cb || angular.noop)();
        return this;
    }

    submit() {
        return this.post;
    }

    previewToggle(cb) {
        this.previewToggle = !this.previewToggle;
        (cb || angular.noop)();
        return this;
    }

    reset(cb) {
        this.post = new Post();
        // this.topic = '';

        (cb || angular.noop)();
        return this;
    }

    edit(post, cb) {
        this.open(post);

        (cb || angular.noop)();
        return this;
    }

    mods() {
        return SynergyComposerController.mods;
    }

    create(mod, cb) {
        var newMod = new Mod(mod);
        newMod.init(function() {
            (cb || angular.noop)();
        });
    }
}

angular.module('synergy.composer', []).controller('SynergyComposerController', SynergyComposerController);
