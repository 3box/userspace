
class Helix {

  constructor (address) {
    // create helix did
    // call helix factory
    // OR: use helix at address
  }

  async applyForMembership (profile, numTokens) {
    // create personal DID
    // call mintAndSetDID
  }

  async listApplicants () {
    // list all addresses that have set a DID,
    // but that have not received an approve claim
  }

  async approveMembership (address) {
    // encrypt the seed of the helix DID to the public key of the applicant
    // call approveMembership
  }

  async mint (numTokens) {
  }

  async burn (numTokens) {
  }

}
