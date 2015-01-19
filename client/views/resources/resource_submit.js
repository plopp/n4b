Template.resourceSubmit.helpers({
  types : function(){
    //TODO If Types.find return more than one object there will be problems, that will happen if two Signal types are created with the same name.
    return Types.find();
  }
});


Template.resourceSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var selType = Session.get("selectedType");
    var max = $(e.target).find('[name=max]').val();
    var min = $(e.target).find('[name=min]').val();
    console.log(max+ " " + min);
    if(max>min){
      var resource = {
        title: $(e.target).find('[name=title]').val(),
        typeId: selType,
        max: max,
        min: min,
        unit: $(e.target).find('[name=unit]').val(),
        value: 0,
        plcVar: $(e.target).find('[name=plcvar]').val(),
		logInterval: 1
      }
      resource._id = Resources.insert(resource);
      Router.go('resourcePage');
      return true;
    }
    else{
      alert("Error: Max needs to be larger than min.");
      return false;
    }

  },
  'click #cancel-btn': function(e) {
    e.preventDefault();
    Router.go('resourcePage');
  },
  "change #type_select": function(evt) {
    var typeId = $(evt.target).val(); //The resource ID is stored in the value property in every option.
    Session.set("selectedType", typeId)
    console.log(typeId);
  }
});

Template.resourceSubmit.rendered = function() {
    
  Meteor.defer(function() {
    var selVal = $('#type_select').val();
    Session.set("selectedType", selVal);
    console.log("Selected type: "+Types.findOne(selVal).title);
    $("[name=title]").focus();
    console.log("Rendered submit form.");
  });
};