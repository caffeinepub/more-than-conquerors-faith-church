import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Event Management Types & Functions
  type EventType = {
    #sundayService;
    #bibleStudy;
    #conference;
    #youth;
    #community;
  };

  type Event = {
    id : Nat;
    title : Text;
    description : Text;
    dateTime : Time.Time;
    eventType : EventType;
    location : Text;
    registrationLink : Text;
  };

  module Event {
    public func compare(event1 : Event, event2 : Event) : Order.Order {
      Text.compare(event1.title, event2.title);
    };
  };

  // Sermon Management Types & Functions
  type Sermon = {
    id : Nat;
    title : Text;
    speaker : Text;
    date : Time.Time;
    description : Text;
    youtubeId : Text;
    seriesName : Text;
    tags : [Text];
  };

  module Sermon {
    public func compare(sermon1 : Sermon, sermon2 : Sermon) : Order.Order {
      Text.compare(sermon1.title, sermon2.title);
    };
  };

  // Prayer Request Types & Functions
  type PrayerRequest = {
    id : Nat;
    name : Text;
    email : Text;
    prayerText : Text;
    submittedDate : Time.Time;
  };

  module PrayerRequest {
    public func compare(request1 : PrayerRequest, request2 : PrayerRequest) : Order.Order {
      Text.compare(request1.name, request2.name);
    };
  };

  // Testimony Types & Functions
  type TestimonyCategory = {
    #faith;
    #healing;
    #restoration;
    #growth;
  };

  type Testimony = {
    id : Nat;
    name : Text;
    storyText : Text;
    category : TestimonyCategory;
    approved : Bool;
  };

  module Testimony {
    public func compare(testimony1 : Testimony, testimony2 : Testimony) : Order.Order {
      Text.compare(testimony1.name, testimony2.name);
    };
  };

  // Newsletter Subscriber Types & Functions
  type NewsletterSubscriber = {
    email : Text;
    signupDate : Time.Time;
  };

  module NewsletterSubscriber {
    public func compare(subscriber1 : NewsletterSubscriber, subscriber2 : NewsletterSubscriber) : Order.Order {
      Text.compare(subscriber1.email, subscriber2.email);
    };
  };

  // Giving Info Types & Functions
  type GivingFund = {
    fundName : Text;
    description : Text;
    goalAmount : ?Nat;
  };

  module GivingFund {
    public func compare(fund1 : GivingFund, fund2 : GivingFund) : Order.Order {
      Text.compare(fund1.fundName, fund2.fundName);
    };
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // State Management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent Storage
  let events = Map.empty<Nat, Event>();
  let sermons = Map.empty<Nat, Sermon>();
  let prayerRequests = Map.empty<Nat, PrayerRequest>();
  let testimonies = Map.empty<Nat, Testimony>();
  let newsletterSubscribers = Map.empty<Text, NewsletterSubscriber>();
  let givingFunds = Map.empty<Text, GivingFund>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ID Counters
  var eventIdCounter = 0;
  var sermonIdCounter = 0;
  var prayerRequestIdCounter = 0;
  var testimonyIdCounter = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Event Management Functions
  public shared ({ caller }) func createEvent(event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    let newEvent = { event with id = eventIdCounter };
    events.add(eventIdCounter, newEvent);
    eventIdCounter += 1;
  };

  public shared ({ caller }) func updateEvent(id : Nat, event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    let updatedEvent = { event with id };
    events.add(id, updatedEvent);
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    events.remove(id);
  };

  public query func getEventsByType(eventType : EventType) : async [Event] {
    events.values().toArray().filter(
      func(event) {
        event.eventType == eventType;
      }
    );
  };

  public query func getAllUpcomingEvents() : async [Event] {
    events.values().toArray().sort();
  };

  // Sermon Management Functions
  public shared ({ caller }) func createSermon(sermon : Sermon) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create sermons");
    };
    let newSermon = { sermon with id = sermonIdCounter };
    sermons.add(sermonIdCounter, newSermon);
    sermonIdCounter += 1;
  };

  public shared ({ caller }) func updateSermon(id : Nat, sermon : Sermon) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update sermons");
    };
    let updatedSermon = { sermon with id };
    sermons.add(id, updatedSermon);
  };

  public shared ({ caller }) func deleteSermon(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sermons");
    };
    sermons.remove(id);
  };

  public query func getSermonsBySeries(seriesName : Text) : async [Sermon] {
    sermons.values().toArray().filter(
      func(sermon) {
        sermon.seriesName == seriesName;
      }
    );
  };

  public query func searchSermonsByTag(tag : Text) : async [Sermon] {
    sermons.values().toArray().filter(
      func(sermon) {
        sermon.tags.values().any(
          func(t) {
            t == tag;
          }
        );
      }
    );
  };

  public query func getAllSermons() : async [Sermon] {
    sermons.values().toArray().sort();
  };

  // Prayer Request Functions
  public shared func submitPrayerRequest(request : PrayerRequest) : async () {
    let newRequest = { request with id = prayerRequestIdCounter };
    prayerRequests.add(prayerRequestIdCounter, newRequest);
    prayerRequestIdCounter += 1;
  };

  public query ({ caller }) func getAllPrayerRequests() : async [PrayerRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view prayer requests");
    };
    prayerRequests.values().toArray().sort();
  };

  // Testimony Functions
  public shared func submitTestimony(testimony : Testimony) : async () {
    let newTestimony = { testimony with id = testimonyIdCounter; approved = false };
    testimonies.add(testimonyIdCounter, newTestimony);
    testimonyIdCounter += 1;
  };

  public shared ({ caller }) func approveTestimony(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve testimonies");
    };
    let testimony = switch (testimonies.get(id)) {
      case (null) { Runtime.trap("Testimony not found") };
      case (?t) { t };
    };
    let approvedTestimony = { testimony with approved = true };
    testimonies.add(id, approvedTestimony);
  };

  public query func getApprovedTestimonies() : async [Testimony] {
    testimonies.values().toArray().filter(
      func(testimony) {
        testimony.approved;
      }
    );
  };

  // Newsletter Subscriber Functions
  public shared func subscribeNewsletter(email : Text) : async () {
    if (newsletterSubscribers.containsKey(email)) {
      Runtime.trap("Email already subscribed");
    };
    let subscriber = {
      email;
      signupDate = Time.now();
    };
    newsletterSubscribers.add(email, subscriber);
  };

  public query ({ caller }) func getAllNewsletterSubscribers() : async [NewsletterSubscriber] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view subscribers");
    };
    newsletterSubscribers.values().toArray().sort();
  };

  // Giving Fund Functions
  public shared ({ caller }) func createGivingFund(fund : GivingFund) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create giving funds");
    };
    givingFunds.add(fund.fundName, fund);
  };

  public shared ({ caller }) func updateGivingFund(fund : GivingFund) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update giving funds");
    };
    givingFunds.add(fund.fundName, fund);
  };

  public shared ({ caller }) func deleteGivingFund(fundName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete giving funds");
    };
    givingFunds.remove(fundName);
  };

  public query func getAllGivingFunds() : async [GivingFund] {
    givingFunds.values().toArray().sort();
  };
};
