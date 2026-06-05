package com.emotiondiary.controller;

import org.springframework.security.core.Authentication;

abstract class BaseController {

  protected Long uid(Authentication authentication) {
    return Long.valueOf(authentication.getName());
  }
}
