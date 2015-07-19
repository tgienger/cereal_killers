/* global Discussions, Mongo */

Discussions = new Mongo.Collection('discussions');

Discussions.allow({
    insert: (userId, discussion) => {
        
        if (!userId || userId !== discussion.author._id)
            return false;
            
        var allowed = Rules.findOne({ name: 'discussions' }).insert;
        
        if (!Roles.userIsInRole(userId, allowed)) {
            return false;
        }
        return true;
    },
    update: (userId, discussion) => {
        
        if (!userId || userId !== discussion.author._id) {
            return false;
        }
        
        var allowed = Rules.findOne({ name: 'discussions' }).all;
        
        if (!Roles.userIsInRole(userId, allowed))
            return false;
        return true;
    },
    remove: (userId, discussion) => {
        
        var allowed = Rules.findOne({ name: 'discussions' }).remove;
        
        if (!Roles.userIsInRole(userId, allowed))
            return false;
        return true;
    }
});