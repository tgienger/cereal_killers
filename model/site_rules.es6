/* global Rules, Roles */
Rules = new Meteor.Collection('rules');

Rules.allow({
    insert: (userId, rule) => {
        
        if (Roles.userIsInRole(userId, ['admin'])) {
            return true;
        }
        
        return false;
    },
    update: (userId, rule, fields, modifier) => {
        
        if (Roles.userIsInRole(userId, ['admin'])) {
            return true;
        }
        
        return false;
    },
    remove: (userId, rule) => {
        
        if (Roles.userIsInRole(userId, ['admin'])) {
            return true;
        }
        
        return false;
    }
});
//# sourceMappingURL=site_rules.js.map