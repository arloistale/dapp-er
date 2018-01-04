App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3provider = web3.currentProvider;
    } else {
      // fall back to Ganache
      App.web3provider = Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      var artifact = data;
      App.contracts.Adoption = TruffleContract(artifact);

      App.contracts.Adoption.setProvider(App.web3provider);

      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
        var adopterStatus = '';

        for (i = 0; i < adopters.length; i++) {
          adopterStatus += i + ':';
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            adopterStatus += 'y,';

            $('.panel-pet').eq(i).find('button')
              .text('Success')
              .attr('disabled', true);
          } else {
            adopterStatus += 'n,';
          }
        }

        console.log(adopterStatus);
    }).catch(function(error) {
      console.log(error.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var adoptionInstance;

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function(accountError, accounts) {
      if (accountError) {
        console.log(accountError);
        return;
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        App.markAdopted();
      }).catch(function(error) {
        console.log(error);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
