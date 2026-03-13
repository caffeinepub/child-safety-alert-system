import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Child = {
    name : Text;
    age : Nat;
    chipID : Text;
    parentPhone : Text;
    emergency : Bool;
  };

  let children = Map.empty<Text, Child>();

  public shared ({ caller }) func registerChild(name : Text, age : Nat, chipID : Text, parentPhone : Text) : async () {
    if (children.containsKey(chipID)) { Runtime.trap("ChipID already registered") };
    let child : Child = {
      name;
      age;
      chipID;
      parentPhone;
      emergency = false;
    };
    children.add(chipID, child);
  };

  public shared ({ caller }) func scanChip(chipID : Text) : async Child {
    switch (children.get(chipID)) {
      case (null) { Runtime.trap("No child found for this chipID") };
      case (?child) {
        let updatedChild : Child = {
          name = child.name;
          age = child.age;
          chipID = child.chipID;
          parentPhone = child.parentPhone;
          emergency = true;
        };
        children.add(chipID, updatedChild);
        updatedChild;
      };
    };
  };

  public query ({ caller }) func getChild(chipID : Text) : async Child {
    switch (children.get(chipID)) {
      case (null) { Runtime.trap("No child found for this chipID") };
      case (?child) { child };
    };
  };

  public query ({ caller }) func getAllChildren() : async [Child] {
    children.values().toArray();
  };

  public shared ({ caller }) func clearEmergency(chipID : Text) : async () {
    switch (children.get(chipID)) {
      case (null) { Runtime.trap("No child found for this chipID") };
      case (?child) {
        let updatedChild : Child = {
          name = child.name;
          age = child.age;
          chipID = child.chipID;
          parentPhone = child.parentPhone;
          emergency = false;
        };
        children.add(chipID, updatedChild);
      };
    };
  };
};
