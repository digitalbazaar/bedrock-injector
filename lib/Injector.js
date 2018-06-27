/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {BedrockError} = require('bedrock').util;

module.exports = class Injector {
  constructor() {
    // used to track registered plugins
    this.plugins = {};
  }

  /**
   * Registers or retrieves a plugin.
   *
   * A plugin can be registered to extend the capabilities of the bedrock
   * subsystem by adding new plugins.
   *
   * @param capabilityName (required) the name of the capability.
   * @param [capabilityValue | undefined] either the value of the capability:
   *          type type type of plugin (e.g. 'storage', 'authorization',
   *            'consensus').
   *          api the javascript API for the plugin.
   *        or `undefined` to use this function as a synchronous getter.
   */
  use(capabilityName, capabilityValue) {
    const self = this;

    if(!capabilityName) {
      throw new TypeError('`capabilityName` is a required parameter.');
    }

    const plugin = self.plugins[capabilityName];

    // synchronous getter
    if(capabilityValue === undefined) {
      if(!plugin) {
        throw new BedrockError(
          'Plugin not found.', 'NotFoundError', {capabilityName});
      }
      return plugin;
    }

    // synchronous setter
    if(plugin) {
      throw new BedrockError(
        'Plugin already registered.', 'DuplicateError', {capabilityName});
    }
    if(!(capabilityValue.api && capabilityValue.type)) {
      throw new TypeError(
        '`api` and `type` are required `capabililtyValue` properties.');
    }
    self.plugins[capabilityName] = capabilityValue;
  }
};
