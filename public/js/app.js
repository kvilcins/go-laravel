/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/adapters/adapters.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http.js */ "./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr.js */ "./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fetch.js */ "./node_modules/axios/lib/adapters/fetch.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");






const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetch: _fetch_js__WEBPACK_IMPORTED_MODULE_2__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/fetch.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/adapters/fetch.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/composeSignals.js */ "./node_modules/axios/lib/helpers/composeSignals.js");
/* harmony import */ var _helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/trackStream.js */ "./node_modules/axios/lib/helpers/trackStream.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/settle.js */ "./node_modules/axios/lib/core/settle.js");










const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
}

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"](`Response type '${type}' is not supported`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isBlob(body)) {
    return body.size;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isSpecCompliantForm(body)) {
    const _request = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBufferView(body) || _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isURLSearchParams(body)) {
    body = body + '';
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = (0,_helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__["default"])([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        const [onProgress, flush] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
          requestContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onUploadProgress))
        );

        data = (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request, fetchOptions);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventDecorator)(
        responseContentLength,
        (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.progressEventReducer)((0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_5__.asyncDecorator)(onDownloadProgress), true)
      ) || [];

      response = new Response(
        (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_6__.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_7__["default"])(resolve, reject, {
        data: responseData,
        headers: _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__["default"].from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].from(err, err && err.code, config, request);
  }
}));




/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../core/settle.js */ "./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers/parseProtocol.js */ "./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/progressEventReducer.js */ "./node_modules/axios/lib/helpers/progressEventReducer.js");
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/resolveConfig.js */ "./node_modules/axios/lib/helpers/resolveConfig.js");











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    let requestData = _config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__["default"];
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__.progressEventReducer)(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__["default"])(_config.url);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_9__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Axios.js */ "./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cancel/CancelToken.js */ "./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./helpers/spread.js */ "./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/isAxiosError.js */ "./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./helpers/HttpStatusCode.js */ "./node_modules/axios/lib/helpers/HttpStatusCode.js");




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__["default"].getAdapter;

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isCancel)
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InterceptorManager.js */ "./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dispatchRequest.js */ "./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/validator.js */ "./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) {
      // do nothing
    } else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url, config.allowAbsoluteUrls);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosHeaders.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/parseHeaders.js */ "./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(header) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[key = entry[0]] = (dest = obj[key]) ?
          (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
      }

      setHeaders(obj, valueOrRewrite)
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  getSetCookie() {
    return this.get("set-cookie") || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFullPath)
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/isAbsoluteURL.js */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/combineURLs.js */ "./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dispatchRequest)
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformData.js */ "./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ settle)
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transformData)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/toURLEncodedForm.js */ "./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isResponse(data) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)) {
      return data;
    }

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = "1.10.0";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/HttpStatusCode.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bind)
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildURL)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ combineURLs)
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/composeSignals.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/composeSignals.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? err : new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__["default"](err instanceof Error ? err.message : err));
      }
    }

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](`timeout ${timeout} of ms exceeded`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ETIMEDOUT))
    }, timeout)

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    }

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(unsubscribe);

    return signal;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (composeSignals);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path) && cookie.push('path=' + path);

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });



/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/formDataToJSON.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAbsoluteURL)
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAxiosError)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin),
  _platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator && /(msie|trident)/i.test(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].navigator.userAgent)
) : () => true);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseProtocol)
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/progressEventReducer.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/progressEventReducer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncDecorator: () => (/* binding */ asyncDecorator),
/* harmony export */   progressEventDecorator: () => (/* binding */ progressEventDecorator),
/* harmony export */   progressEventReducer: () => (/* binding */ progressEventReducer)
/* harmony export */ });
/* harmony import */ var _speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./speedometer.js */ "./node_modules/axios/lib/helpers/speedometer.js");
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./throttle.js */ "./node_modules/axios/lib/helpers/throttle.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0,_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return (0,_throttle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
}

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
}

const asyncDecorator = (fn) => (...args) => _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].asap(() => fn(...args));


/***/ }),

/***/ "./node_modules/axios/lib/helpers/resolveConfig.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/resolveConfig.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isURLSameOrigin.js */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _cookies_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cookies.js */ "./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _buildURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((config) => {
  const newConfig = (0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(headers);

  newConfig.url = (0,_buildURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__["default"])(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFormData(data)) {
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv) {
    withXSRFToken && _utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && (0,_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__["default"])(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies_js__WEBPACK_IMPORTED_MODULE_7__["default"].read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});



/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/speedometer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ spread)
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/throttle.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/throttle.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  }

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs)
        }, threshold - passed);
      }
    }
  }

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/node/classes/FormData.js */ "./node_modules/axios/lib/helpers/null.js");




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBoolean(value)) {
      return value.toString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toURLEncodedForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toURLEncodedForm)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/trackStream.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/trackStream.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readBytes: () => (/* binding */ readBytes),
/* harmony export */   streamChunk: () => (/* binding */ streamChunk),
/* harmony export */   trackStream: () => (/* binding */ trackStream)
/* harmony export */ });

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
}

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/Blob.js":
/*!*****************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/Blob.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/FormData.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/*!****************************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/URLSearchParams.js */ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/FormData.js */ "./node_modules/axios/lib/platform/browser/classes/FormData.js");
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Blob.js */ "./node_modules/axios/lib/platform/browser/classes/Blob.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/common/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/platform/common/utils.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasBrowserEnv: () => (/* binding */ hasBrowserEnv),
/* harmony export */   hasStandardBrowserEnv: () => (/* binding */ hasStandardBrowserEnv),
/* harmony export */   hasStandardBrowserWebWorkerEnv: () => (/* binding */ hasStandardBrowserWebWorkerEnv),
/* harmony export */   navigator: () => (/* binding */ _navigator),
/* harmony export */   origin: () => (/* binding */ origin)
/* harmony export */ });
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';




/***/ }),

/***/ "./node_modules/axios/lib/platform/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/platform/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils.js */ "./node_modules/axios/lib/platform/common/utils.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ..._common_utils_js__WEBPACK_IMPORTED_MODULE_0__,
  ..._node_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;
const {iterator, toStringTag} = Symbol;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************


const isIterable = (thing) => thing != null && isFunction(thing[iterator]);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
});


/***/ }),

/***/ "./resources/js/admin/delete.js":
/*!**************************************!*\
  !*** ./resources/js/admin/delete.js ***!
  \**************************************/
/***/ (() => {

const confirmDelete = (message = 'Вы уверены, что хотите удалить?') => {
  return confirm(message);
};
document.querySelectorAll('form[data-confirm]').forEach(form => {
  form.addEventListener('submit', e => {
    if (!confirmDelete(form.dataset.confirm)) {
      e.preventDefault();
    }
  });
});

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");
/* harmony import */ var _admin_delete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin/delete */ "./resources/js/admin/delete.js");
/* harmony import */ var _admin_delete__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_admin_delete__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/slider */ "./resources/js/modules/slider.js");
/* harmony import */ var _modules_slider__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modules_slider__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modules_accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/accordion */ "./resources/js/modules/accordion.js");
/* harmony import */ var _modules_accordion__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_accordion__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/modal */ "./resources/js/modules/modal.js");
/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_modal__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _modules_booking__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/booking */ "./resources/js/modules/booking.js");
/* harmony import */ var _modules_booking__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_modules_booking__WEBPACK_IMPORTED_MODULE_5__);







/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");

window.axios = axios__WEBPACK_IMPORTED_MODULE_0__["default"];
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/***/ }),

/***/ "./resources/js/modules/accordion.js":
/*!*******************************************!*\
  !*** ./resources/js/modules/accordion.js ***!
  \*******************************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', () => {
  const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq__item');
    if (!faqItems.length) return;
    const closeAllExcept = exceptItem => {
      faqItems.forEach(item => {
        if (item !== exceptItem) {
          item.classList.remove('faq__item--active');
        }
      });
    };
    const toggleItem = item => {
      const isActive = item.classList.contains('faq__item--active');
      if (isActive) {
        item.classList.remove('faq__item--active');
      } else {
        closeAllExcept(item);
        item.classList.add('faq__item--active');
      }
    };
    faqItems.forEach(item => {
      const button = item.querySelector('.faq__button');
      if (button) {
        button.addEventListener('click', () => {
          toggleItem(item);
        });
        button.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleItem(item);
          }
        });
      }
    });
    if (faqItems.length > 0) {
      faqItems[0].classList.add('faq__item--active');
    }
  };
  initFaqAccordion();
});

/***/ }),

/***/ "./resources/js/modules/booking.js":
/*!*****************************************!*\
  !*** ./resources/js/modules/booking.js ***!
  \*****************************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', () => {
  const roomInputs = document.querySelectorAll('input[name="room_id"]');
  const dateSelect = document.querySelector('select[name="date"]');
  const timeSelect = document.querySelector('select[name="time_slot_id"]');
  const bookingForm = document.querySelector('.booking__form');
  const loadAvailableDates = () => {
    if (!dateSelect) return;
    fetch('/booking/available-dates').then(response => response.json()).then(data => {
      if (data.error) {
        dateSelect.innerHTML = '<option value="">Ошибка загрузки дат</option>';
        return;
      }
      dateSelect.innerHTML = '<option value="">Дата</option>';
      data.dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date.value;
        option.textContent = date.label;
        dateSelect.appendChild(option);
      });
    }).catch(error => {
      console.error('Error loading dates:', error);
      if (dateSelect) {
        dateSelect.innerHTML = '<option value="">Ошибка загрузки дат</option>';
      }
    });
  };
  const showTimeMessage = text => {
    if (!timeSelect) return;
    timeSelect.innerHTML = `<option value="">${text}</option>`;
    timeSelect.disabled = true;
  };
  const loadAvailableSlots = () => {
    const selectedRoom = document.querySelector('input[name="room_id"]:checked');
    const selectedDate = dateSelect ? dateSelect.value : '';
    if (!selectedRoom || !selectedDate) {
      showTimeMessage('Сначала выберите комнату и дату');
      return;
    }
    showTimeMessage('Загрузка...');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('input[name="_token"]')?.value;
    fetch('/booking/available-slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken || ''
      },
      body: JSON.stringify({
        room_id: selectedRoom.value,
        date: selectedDate
      })
    }).then(response => response.json()).then(data => {
      if (data.error) {
        showTimeMessage('Ошибка загрузки');
        return;
      }
      if (!timeSelect) return;
      timeSelect.innerHTML = '<option value="">Выберите время</option>';
      if (Array.isArray(data.available_times) && data.available_times.length > 0) {
        data.available_times.forEach(slot => {
          const option = document.createElement('option');
          option.value = slot.value;
          option.textContent = slot.label;
          timeSelect.appendChild(option);
        });
        timeSelect.disabled = false;
      } else {
        showTimeMessage('Нет доступных слотов');
      }
    }).catch(error => {
      console.error('Error loading slots:', error);
      showTimeMessage('Ошибка загрузки');
    });
  };
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 500;
        `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };
  loadAvailableDates();
  roomInputs.forEach(input => {
    input.addEventListener('change', loadAvailableSlots);
  });
  if (dateSelect) {
    dateSelect.addEventListener('change', loadAvailableSlots);
  }
  if (bookingForm) {
    bookingForm.addEventListener('submit', async e => {
      e.preventDefault();
      const submitButton = bookingForm.querySelector('.booking__submit');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Отправка...';
      submitButton.disabled = true;
      const formData = new FormData(bookingForm);
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || document.querySelector('input[name="_token"]')?.value;
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response was:', responseText.substring(0, 500));
          throw new Error('Сервер вернул некорректный ответ');
        }
        if (response.ok && result.success) {
          showNotification(result.message || 'Бронирование успешно создано!', 'success');
          bookingForm.reset();
          if (timeSelect) {
            timeSelect.innerHTML = '<option value="">Сначала выберите дату и зал</option>';
            timeSelect.disabled = true;
          }
          if (dateSelect) dateSelect.selectedIndex = 0;
          roomInputs.forEach(input => input.checked = false);
        } else {
          showNotification(result.message || 'Ошибка при бронировании', 'error');
        }
      } catch (error) {
        console.error('Booking error:', error);
        showNotification('Ошибка при отправке формы', 'error');
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }
});

/***/ }),

/***/ "./resources/js/modules/modal.js":
/*!***************************************!*\
  !*** ./resources/js/modules/modal.js ***!
  \***************************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', () => {
  const modalTriggers = document.querySelectorAll('[data-modal-open]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.modal');
  const callbackForm = document.querySelector('.modal__form');
  const openModal = modalName => {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    if (modal) {
      modal.classList.add('modal--active');
      document.body.style.overflow = 'hidden';
    }
  };
  const closeModal = modal => {
    modal.classList.remove('modal--active');
    document.body.style.overflow = '';
  };
  const closeAllModals = () => {
    modals.forEach(modal => {
      closeModal(modal);
    });
  };
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 500;
        `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalName = trigger.getAttribute('data-modal-open');
      openModal(modalName);
    });
  });
  modalCloseButtons.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
      const modal = closeButton.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
  modals.forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.hasAttribute('data-modal-close')) {
        closeModal(modal);
      }
    });
  });
  if (callbackForm) {
    callbackForm.addEventListener('submit', async e => {
      e.preventDefault();
      const submitButton = callbackForm.querySelector('.modal__submit');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Отправка...';
      submitButton.disabled = true;
      const formData = new FormData(callbackForm);
      try {
        const response = await fetch('/callback', {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        });
        const result = await response.json();
        if (result.success) {
          showNotification('Заявка успешно отправлена!', 'success');
          callbackForm.reset();
          closeAllModals();
        } else {
          showNotification(result.message || 'Ошибка при отправке', 'error');
        }
      } catch (error) {
        showNotification('Ошибка при отправке заявки', 'error');
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }
});

/***/ }),

/***/ "./resources/js/modules/slider.js":
/*!****************************************!*\
  !*** ./resources/js/modules/slider.js ***!
  \****************************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', () => {
  const initFeedbacksSlider = () => {
    const slider = document.querySelector('.feedbacks__slider');
    if (!slider) return;
    const track = slider.querySelector('.feedbacks__track');
    const slides = slider.querySelectorAll('.feedbacks__slide');
    const prevBtn = slider.querySelector('.feedbacks__btn--prev');
    const nextBtn = slider.querySelector('.feedbacks__btn--next');
    const dotsContainer = slider.querySelector('.feedbacks__dots');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayInterval = null;
    let isAutoplayPaused = false;
    if (totalSlides === 0) return;
    const createDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('feedbacks__dot');
        dot.setAttribute('data-slide', i);
        dot.setAttribute('type', 'button');
        if (i === 0) dot.classList.add('feedbacks__dot--active');
        dotsContainer.appendChild(dot);
      }
    };
    const updateSlider = () => {
      const translateX = -currentSlide * 100;
      track.style.transform = `translateX(${translateX}%)`;
      const dots = dotsContainer.querySelectorAll('.feedbacks__dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('feedbacks__dot--active', index === currentSlide);
      });
      prevBtn.style.opacity = totalSlides <= 1 ? '0.3' : '1';
      nextBtn.style.opacity = totalSlides <= 1 ? '0.3' : '1';
      prevBtn.style.pointerEvents = totalSlides <= 1 ? 'none' : 'auto';
      nextBtn.style.pointerEvents = totalSlides <= 1 ? 'none' : 'auto';
    };
    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    };
    const prevSlide = () => {
      currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
      updateSlider();
    };
    const goToSlide = slideIndex => {
      if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateSlider();
      }
    };
    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };
    const startAutoplay = () => {
      if (totalSlides <= 1 || isAutoplayPaused) return;
      stopAutoplay(); // Убеждаемся, что нет дублирования
      autoplayInterval = setInterval(() => {
        if (!isAutoplayPaused) {
          nextSlide();
        }
      }, 4000);
    };
    const pauseAutoplay = (duration = 8000) => {
      stopAutoplay();
      setTimeout(() => {
        if (!isAutoplayPaused) {
          startAutoplay();
        }
      }, duration);
    };
    nextBtn?.addEventListener('click', () => {
      nextSlide();
      pauseAutoplay();
    });
    prevBtn?.addEventListener('click', () => {
      prevSlide();
      pauseAutoplay();
    });
    dotsContainer?.addEventListener('click', e => {
      if (e.target.classList.contains('feedbacks__dot')) {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToSlide(slideIndex);
        pauseAutoplay();
      }
    });
    let isSliderFocused = false;
    slider.addEventListener('mouseenter', () => {
      isSliderFocused = true;
    });
    slider.addEventListener('mouseleave', () => {
      isSliderFocused = false;
    });
    document.addEventListener('keydown', e => {
      if (!isSliderFocused) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        pauseAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        pauseAutoplay();
      }
    });
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    const handleSwipe = () => {
      if (!isSwiping) return;
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        pauseAutoplay();
      }
      isSwiping = false;
    };
    track?.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      isSwiping = true;
    }, {
      passive: true
    });
    track?.addEventListener('touchmove', e => {
      if (isSwiping) {
        e.preventDefault();
      }
    }, {
      passive: false
    });
    track?.addEventListener('touchend', e => {
      if (isSwiping) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }
    }, {
      passive: true
    });
    slider.addEventListener('mouseenter', () => {
      isAutoplayPaused = true;
      stopAutoplay();
    });
    slider.addEventListener('mouseleave', () => {
      isAutoplayPaused = false;
      startAutoplay();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (!isAutoplayPaused) {
        startAutoplay();
      }
    });
    window.addEventListener('resize', () => {
      updateSlider();
    });
    createDots();
    updateSlider();
    setTimeout(() => {
      startAutoplay();
    }, 100);
  };
  initFeedbacksSlider();
});

/***/ }),

/***/ "./resources/scss/app.scss":
/*!*********************************!*\
  !*** ./resources/scss/app.scss ***!
  \*********************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nHookWebpackError: Cannot find module '../fonts/inter-semibold.woff2'\n    at tryRunOrWebpackError (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/HookWebpackError.js:86:9)\n    at __webpack_require_module__ (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5464:12)\n    at __webpack_require__ (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5411:18)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5498:20\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3485:9)\n    at done (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (/Users/Projects/Local/docker-local/sites/go-games/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5386:43\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3482:9)\n    at timesSync (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:2297:7)\n    at Object.eachLimit (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3463:5)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5348:16\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3485:9)\n    at timesSync (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:2297:7)\n    at Object.eachLimit (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3463:5)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5316:15\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3485:9)\n    at done (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3527:9)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5262:8\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:3680:5\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Cache.js:99:5\n    at Hook.eval [as callAsync] (eval at create (/Users/Projects/Local/docker-local/sites/go-games/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:16:1)\n    at Cache.get (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Cache.js:81:18)\n    at ItemCacheFacade.get (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:3644:9)\n    at codeGen (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5250:11)\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3482:9)\n    at timesSync (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:2297:7)\n    at Object.eachLimit (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3463:5)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5280:14\n    at processQueue (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/util/processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:85:11)\n-- inner error --\nError: Cannot find module '../fonts/inter-semibold.woff2'\n    at webpackMissingModule (/Users/Projects/Local/docker-local/sites/go-games/node_modules/css-loader/dist/cjs.js!/Users/Projects/Local/docker-local/sites/go-games/node_modules/sass-loader/dist/cjs.js!/Users/Projects/Local/docker-local/sites/go-games/resources/scss/app.scss:15:113)\n    at Module.<anonymous> (/Users/Projects/Local/docker-local/sites/go-games/node_modules/css-loader/dist/cjs.js!/Users/Projects/Local/docker-local/sites/go-games/node_modules/sass-loader/dist/cjs.js!/Users/Projects/Local/docker-local/sites/go-games/resources/scss/app.scss:15:217)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/javascript/JavascriptModulesPlugin.js:518:10\n    at Hook.eval [as call] (eval at create (/Users/Projects/Local/docker-local/sites/go-games/node_modules/tapable/lib/HookCodeFactory.js:19:10), <anonymous>:7:1)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5466:39\n    at tryRunOrWebpackError (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/HookWebpackError.js:81:7)\n    at __webpack_require_module__ (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5464:12)\n    at __webpack_require__ (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5411:18)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5498:20\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3485:9)\n    at done (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3527:9)\n    at Hook.eval [as callAsync] (eval at create (/Users/Projects/Local/docker-local/sites/go-games/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5386:43\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3482:9)\n    at timesSync (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:2297:7)\n    at Object.eachLimit (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3463:5)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5348:16\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3485:9)\n    at timesSync (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:2297:7)\n    at Object.eachLimit (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3463:5)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5316:15\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3485:9)\n    at done (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3527:9)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5262:8\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:3680:5\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Cache.js:99:5\n    at Hook.eval [as callAsync] (eval at create (/Users/Projects/Local/docker-local/sites/go-games/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:16:1)\n    at Cache.get (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Cache.js:81:18)\n    at ItemCacheFacade.get (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/CacheFacade.js:116:15)\n    at Compilation._codeGenerationModule (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:3644:9)\n    at codeGen (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5250:11)\n    at symbolIterator (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3482:9)\n    at timesSync (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:2297:7)\n    at Object.eachLimit (/Users/Projects/Local/docker-local/sites/go-games/node_modules/neo-async/async.js:3463:5)\n    at /Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/Compilation.js:5280:14\n    at processQueue (/Users/Projects/Local/docker-local/sites/go-games/node_modules/webpack/lib/util/processAsyncTree.js:61:4)\n    at process.processTicksAndRejections (node:internal/process/task_queues:85:11)\n\nGenerated code for /Users/Projects/Local/docker-local/sites/go-games/node_modules/css-loader/dist/cjs.js!/Users/Projects/Local/docker-local/sites/go-games/node_modules/sass-loader/dist/cjs.js!/Users/Projects/Local/docker-local/sites/go-games/resources/scss/app.scss\n   1 | __webpack_require__.r(__webpack_exports__);\n   2 | /* harmony export */ __webpack_require__.d(__webpack_exports__, {\n   3 | /* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n   4 | /* harmony export */ });\n   5 | /* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ \"/Users/Projects/Local/docker-local/sites/go-games/node_modules/css-loader/dist/runtime/sourceMaps.js\");\n   6 | /* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n   7 | /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"/Users/Projects/Local/docker-local/sites/go-games/node_modules/css-loader/dist/runtime/api.js\");\n   8 | /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n   9 | /* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ \"/Users/Projects/Local/docker-local/sites/go-games/node_modules/css-loader/dist/runtime/getUrl.js\");\n  10 | /* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);\n  11 | // Imports\n  12 | \n  13 | \n  14 | \n  15 | var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ Object(function webpackMissingModule() { var e = new Error(\"Cannot find module '../fonts/inter-semibold.woff2'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__.b);\n  16 | var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ Object(function webpackMissingModule() { var e = new Error(\"Cannot find module '../fonts/inter-semibold.woff'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__.b);\n  17 | var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ Object(function webpackMissingModule() { var e = new Error(\"Cannot find module '../fonts/inter-bold.woff2'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__.b);\n  18 | var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ Object(function webpackMissingModule() { var e = new Error(\"Cannot find module '../fonts/inter-bold.woff'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__.b);\n  19 | var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! ../img/rooms/80s-vibes.jpg */ \"asset/resource|/Users/Projects/Local/docker-local/sites/go-games/resources/img/rooms/80s-vibes.jpg\"), __webpack_require__.b);\n  20 | var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(/*! ../img/rooms/star-wars.jpg */ \"asset/resource|/Users/Projects/Local/docker-local/sites/go-games/resources/img/rooms/star-wars.jpg\"), __webpack_require__.b);\n  21 | var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(/*! ../img/rooms/wild-west.jpg */ \"asset/resource|/Users/Projects/Local/docker-local/sites/go-games/resources/img/rooms/wild-west.jpg\"), __webpack_require__.b);\n  22 | var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(/*! ../img/rooms/neon-style.jpg */ \"asset/resource|/Users/Projects/Local/docker-local/sites/go-games/resources/img/rooms/neon-style.jpg\"), __webpack_require__.b);\n  23 | var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(/*! ../img/main-banner.png */ \"asset/resource|/Users/Projects/Local/docker-local/sites/go-games/resources/img/main-banner.png\"), __webpack_require__.b);\n  24 | var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n  25 | ___CSS_LOADER_EXPORT___.push([module.id, \"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap);\"]);\n  26 | var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);\n  27 | var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);\n  28 | var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);\n  29 | var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);\n  30 | var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);\n  31 | var ___CSS_LOADER_URL_REPLACEMENT_5___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);\n  32 | var ___CSS_LOADER_URL_REPLACEMENT_6___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);\n  33 | var ___CSS_LOADER_URL_REPLACEMENT_7___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);\n  34 | var ___CSS_LOADER_URL_REPLACEMENT_8___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);\n  35 | // Module\n  36 | ___CSS_LOADER_EXPORT___.push([module.id, `@charset \"UTF-8\";\n  37 | @font-face {\n  38 |   font-family: \"Inter\";\n  39 |   src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format(\"woff2\"), url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format(\"woff\");\n  40 |   font-style: normal;\n  41 |   font-weight: 600;\n  42 | }\n  43 | @font-face {\n  44 |   font-family: \"Inter\";\n  45 |   src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format(\"woff2\"), url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format(\"woff\");\n  46 |   font-style: normal;\n  47 |   font-weight: 700;\n  48 | }\n  49 | html {\n  50 |   box-sizing: border-box;\n  51 |   position: relative;\n  52 | }\n  53 | \n  54 | *,\n  55 | *::before,\n  56 | *::after {\n  57 |   box-sizing: inherit;\n  58 | }\n  59 | \n  60 | body {\n  61 |   background: linear-gradient(to bottom, rgba(205, 6, 255, 0.15) 0%, transparent 100%), linear-gradient(135deg, #1b1a1b 0%, #2a1b2a 50%, #1b1a1b 100%);\n  62 |   color: var(--main-text-color, #FFFFFF);\n  63 |   font-family: Arial, sans-serif;\n  64 |   font-size: 20px;\n  65 |   font-weight: 400;\n  66 |   min-height: 100vh;\n  67 |   margin: 0 auto;\n  68 | }\n  69 | \n  70 | img, svg {\n  71 |   max-width: 100%;\n  72 |   max-height: 100%;\n  73 |   height: auto;\n  74 | }\n  75 | \n  76 | button {\n  77 |   cursor: pointer;\n  78 | }\n  79 | \n  80 | a {\n  81 |   color: inherit;\n  82 |   text-decoration: none;\n  83 | }\n  84 | \n  85 | ul {\n  86 |   padding: 0;\n  87 |   margin: 0;\n  88 |   list-style: none;\n  89 | }\n  90 | \n  91 | figure, fieldset {\n  92 |   margin: 0;\n  93 |   border: none;\n  94 |   padding: 0;\n  95 | }\n  96 | \n  97 | section {\n  98 |   padding: 50px 0 50px 0;\n  99 | }\n 100 | \n 101 | h1 {\n 102 |   font-size: 45px;\n 103 |   text-transform: uppercase;\n 104 |   text-align: center;\n 105 | }\n 106 | \n 107 | h2 {\n 108 |   text-align: center;\n 109 |   text-transform: uppercase;\n 110 |   font-weight: 700;\n 111 |   font-size: 40px;\n 112 |   line-height: 50px;\n 113 |   position: relative;\n 114 |   z-index: 2;\n 115 |   margin-bottom: 80px;\n 116 |   opacity: 0;\n 117 |   animation: titleAppear 1s ease-out forwards;\n 118 | }\n 119 | h2::after {\n 120 |   content: \"\";\n 121 |   position: absolute;\n 122 |   bottom: -15px;\n 123 |   left: 50%;\n 124 |   transform: translateX(-50%);\n 125 |   width: 80px;\n 126 |   height: 3px;\n 127 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n 128 |   border-radius: 2px;\n 129 |   animation: lineExpand 1s ease-out 0.5s forwards;\n 130 |   scale: 0 1;\n 131 | }\n 132 | \n 133 | p {\n 134 |   font-size: 20px;\n 135 | }\n 136 | \n 137 | .container {\n 138 |   max-width: 1180px;\n 139 |   margin: 0 auto;\n 140 | }\n 141 | \n 142 | @media screen and (max-width: 1320px) {\n 143 |   section {\n 144 |     padding: 35px 60px 35px 60px;\n 145 |   }\n 146 |   h1 {\n 147 |     font-size: 35px;\n 148 |   }\n 149 |   h2 {\n 150 |     font-size: 30px;\n 151 |     line-height: 40px;\n 152 |     margin: 0 0 36px 0;\n 153 |   }\n 154 |   p {\n 155 |     font-size: 18px;\n 156 |   }\n 157 |   circle {\n 158 |     stroke: var(--dark-purple, #6C0287);\n 159 |     stroke-width: 1;\n 160 |   }\n 161 | }\n 162 | @media screen and (max-width: 1023px) {\n 163 |   section {\n 164 |     padding: 35px 40px 35px 40px;\n 165 |   }\n 166 |   h1 {\n 167 |     font-size: 28px;\n 168 |   }\n 169 |   h2 {\n 170 |     font-size: 24px;\n 171 |     line-height: 36px;\n 172 |     margin: 0 0 30px 0;\n 173 |   }\n 174 |   p {\n 175 |     font-size: 16px;\n 176 |   }\n 177 | }\n 178 | @media screen and (max-width: 767px) {\n 179 |   h1 {\n 180 |     font-size: 25px;\n 181 |   }\n 182 |   h2 {\n 183 |     font-size: 18px;\n 184 |     line-height: 18px;\n 185 |     margin: 0 0 15px 0;\n 186 |   }\n 187 |   p {\n 188 |     font-size: 14px;\n 189 |   }\n 190 |   section {\n 191 |     padding: 20px 15px 20px 15px;\n 192 |   }\n 193 | }\n 194 | /*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n 195 | /* Document\n 196 |    ========================================================================== */\n 197 | /**\n 198 |  * 1. Correct the line height in all browsers.\n 199 |  * 2. Prevent adjustments of font size after orientation changes in iOS.\n 200 |  */\n 201 | html {\n 202 |   line-height: 1.15; /* 1 */\n 203 |   -webkit-text-size-adjust: 100%; /* 2 */\n 204 | }\n 205 | \n 206 | /* Sections\n 207 |    ========================================================================== */\n 208 | /**\n 209 |  * Remove the margin in all browsers.\n 210 |  */\n 211 | body {\n 212 |   margin: 0;\n 213 | }\n 214 | \n 215 | /**\n 216 |  * Render the \\`main\\` element consistently in IE.\n 217 |  */\n 218 | main {\n 219 |   display: block;\n 220 | }\n 221 | \n 222 | /**\n 223 |  * Correct the font size and margin on \\`h1\\` elements within \\`section\\` and\n 224 |  * \\`article\\` contexts in Chrome, Firefox, and Safari.\n 225 |  */\n 226 | h1 {\n 227 |   font-size: 2em;\n 228 |   margin: 0.67em 0;\n 229 | }\n 230 | \n 231 | /* Grouping content\n 232 |    ========================================================================== */\n 233 | /**\n 234 |  * 1. Add the correct box sizing in Firefox.\n 235 |  * 2. Show the overflow in Edge and IE.\n 236 |  */\n 237 | hr {\n 238 |   box-sizing: content-box; /* 1 */\n 239 |   height: 0; /* 1 */\n 240 |   overflow: visible; /* 2 */\n 241 | }\n 242 | \n 243 | /**\n 244 |  * 1. Correct the inheritance and scaling of font size in all browsers.\n 245 |  * 2. Correct the odd \\`em\\` font sizing in all browsers.\n 246 |  */\n 247 | pre {\n 248 |   font-family: monospace, monospace; /* 1 */\n 249 |   font-size: 1em; /* 2 */\n 250 | }\n 251 | \n 252 | /* Text-level semantics\n 253 |    ========================================================================== */\n 254 | /**\n 255 |  * Remove the gray background on active links in IE 10.\n 256 |  */\n 257 | a {\n 258 |   background-color: transparent;\n 259 | }\n 260 | \n 261 | /**\n 262 |  * 1. Remove the bottom border in Chrome 57-\n 263 |  * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n 264 |  */\n 265 | abbr[title] {\n 266 |   border-bottom: none; /* 1 */\n 267 |   text-decoration: underline; /* 2 */\n 268 |   text-decoration: underline dotted; /* 2 */\n 269 | }\n 270 | \n 271 | /**\n 272 |  * Add the correct font weight in Chrome, Edge, and Safari.\n 273 |  */\n 274 | b,\n 275 | strong {\n 276 |   font-weight: bolder;\n 277 | }\n 278 | \n 279 | /**\n 280 |  * 1. Correct the inheritance and scaling of font size in all browsers.\n 281 |  * 2. Correct the odd \\`em\\` font sizing in all browsers.\n 282 |  */\n 283 | code,\n 284 | kbd,\n 285 | samp {\n 286 |   font-family: monospace, monospace; /* 1 */\n 287 |   font-size: 1em; /* 2 */\n 288 | }\n 289 | \n 290 | /**\n 291 |  * Add the correct font size in all browsers.\n 292 |  */\n 293 | small {\n 294 |   font-size: 80%;\n 295 | }\n 296 | \n 297 | /**\n 298 |  * Prevent \\`sub\\` and \\`sup\\` elements from affecting the line height in\n 299 |  * all browsers.\n 300 |  */\n 301 | sub,\n 302 | sup {\n 303 |   font-size: 75%;\n 304 |   line-height: 0;\n 305 |   position: relative;\n 306 |   vertical-align: baseline;\n 307 | }\n 308 | \n 309 | sub {\n 310 |   bottom: -0.25em;\n 311 | }\n 312 | \n 313 | sup {\n 314 |   top: -0.5em;\n 315 | }\n 316 | \n 317 | /* Embedded content\n 318 |    ========================================================================== */\n 319 | /**\n 320 |  * Remove the border on images inside links in IE 10.\n 321 |  */\n 322 | img {\n 323 |   border-style: none;\n 324 | }\n 325 | \n 326 | /* Forms\n 327 |    ========================================================================== */\n 328 | /**\n 329 |  * 1. Change the font styles in all browsers.\n 330 |  * 2. Remove the margin in Firefox and Safari.\n 331 |  */\n 332 | button,\n 333 | input,\n 334 | optgroup,\n 335 | select,\n 336 | textarea {\n 337 |   font-family: inherit; /* 1 */\n 338 |   font-size: 100%; /* 1 */\n 339 |   line-height: 1.15; /* 1 */\n 340 |   margin: 0; /* 2 */\n 341 | }\n 342 | \n 343 | /**\n 344 |  * Show the overflow in IE.\n 345 |  * 1. Show the overflow in Edge.\n 346 |  */\n 347 | button,\n 348 | input { /* 1 */\n 349 |   overflow: visible;\n 350 | }\n 351 | \n 352 | /**\n 353 |  * Remove the inheritance of text transform in Edge, Firefox, and IE.\n 354 |  * 1. Remove the inheritance of text transform in Firefox.\n 355 |  */\n 356 | button,\n 357 | select { /* 1 */\n 358 |   text-transform: none;\n 359 | }\n 360 | \n 361 | /**\n 362 |  * Correct the inability to style clickable types in iOS and Safari.\n 363 |  */\n 364 | button,\n 365 | [type=button],\n 366 | [type=reset],\n 367 | [type=submit] {\n 368 |   -webkit-appearance: button;\n 369 | }\n 370 | \n 371 | /**\n 372 |  * Remove the inner border and padding in Firefox.\n 373 |  */\n 374 | button::-moz-focus-inner,\n 375 | [type=button]::-moz-focus-inner,\n 376 | [type=reset]::-moz-focus-inner,\n 377 | [type=submit]::-moz-focus-inner {\n 378 |   border-style: none;\n 379 |   padding: 0;\n 380 | }\n 381 | \n 382 | /**\n 383 |  * Restore the focus styles unset by the previous rule.\n 384 |  */\n 385 | button:-moz-focusring,\n 386 | [type=button]:-moz-focusring,\n 387 | [type=reset]:-moz-focusring,\n 388 | [type=submit]:-moz-focusring {\n 389 |   outline: 1px dotted ButtonText;\n 390 | }\n 391 | \n 392 | /**\n 393 |  * Correct the padding in Firefox.\n 394 |  */\n 395 | fieldset {\n 396 |   padding: 0.35em 0.75em 0.625em;\n 397 | }\n 398 | \n 399 | /**\n 400 |  * 1. Correct the text wrapping in Edge and IE.\n 401 |  * 2. Correct the color inheritance from \\`fieldset\\` elements in IE.\n 402 |  * 3. Remove the padding so developers are not caught out when they zero out\n 403 |  *    \\`fieldset\\` elements in all browsers.\n 404 |  */\n 405 | legend {\n 406 |   box-sizing: border-box; /* 1 */\n 407 |   color: inherit; /* 2 */\n 408 |   display: table; /* 1 */\n 409 |   max-width: 100%; /* 1 */\n 410 |   padding: 0; /* 3 */\n 411 |   white-space: normal; /* 1 */\n 412 | }\n 413 | \n 414 | /**\n 415 |  * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n 416 |  */\n 417 | progress {\n 418 |   vertical-align: baseline;\n 419 | }\n 420 | \n 421 | /**\n 422 |  * Remove the default vertical scrollbar in IE 10+.\n 423 |  */\n 424 | textarea {\n 425 |   overflow: auto;\n 426 | }\n 427 | \n 428 | /**\n 429 |  * 1. Add the correct box sizing in IE 10.\n 430 |  * 2. Remove the padding in IE 10.\n 431 |  */\n 432 | [type=checkbox],\n 433 | [type=radio] {\n 434 |   box-sizing: border-box; /* 1 */\n 435 |   padding: 0; /* 2 */\n 436 | }\n 437 | \n 438 | /**\n 439 |  * Correct the cursor style of increment and decrement buttons in Chrome.\n 440 |  */\n 441 | [type=number]::-webkit-inner-spin-button,\n 442 | [type=number]::-webkit-outer-spin-button {\n 443 |   height: auto;\n 444 | }\n 445 | \n 446 | /**\n 447 |  * 1. Correct the odd appearance in Chrome and Safari.\n 448 |  * 2. Correct the outline style in Safari.\n 449 |  */\n 450 | [type=search] {\n 451 |   -webkit-appearance: textfield; /* 1 */\n 452 |   outline-offset: -2px; /* 2 */\n 453 | }\n 454 | \n 455 | /**\n 456 |  * Remove the inner padding in Chrome and Safari on macOS.\n 457 |  */\n 458 | [type=search]::-webkit-search-decoration {\n 459 |   -webkit-appearance: none;\n 460 | }\n 461 | \n 462 | /**\n 463 |  * 1. Correct the inability to style clickable types in iOS and Safari.\n 464 |  * 2. Change font properties to \\`inherit\\` in Safari.\n 465 |  */\n 466 | ::-webkit-file-upload-button {\n 467 |   -webkit-appearance: button; /* 1 */\n 468 |   font: inherit; /* 2 */\n 469 | }\n 470 | \n 471 | /* Interactive\n 472 |    ========================================================================== */\n 473 | /*\n 474 |  * Add the correct display in Edge, IE 10+, and Firefox.\n 475 |  */\n 476 | details {\n 477 |   display: block;\n 478 | }\n 479 | \n 480 | /*\n 481 |  * Add the correct display in all browsers.\n 482 |  */\n 483 | summary {\n 484 |   display: list-item;\n 485 | }\n 486 | \n 487 | /* Misc\n 488 |    ========================================================================== */\n 489 | /**\n 490 |  * Add the correct display in IE 10+.\n 491 |  */\n 492 | template {\n 493 |   display: none;\n 494 | }\n 495 | \n 496 | /**\n 497 |  * Add the correct display in IE 10.\n 498 |  */\n 499 | [hidden] {\n 500 |   display: none;\n 501 | }\n 502 | \n 503 | .admin-layout {\n 504 |   display: flex;\n 505 |   min-height: 100vh;\n 506 | }\n 507 | \n 508 | .admin-sidebar {\n 509 |   width: 250px;\n 510 |   background: linear-gradient(135deg, #6C0287, #CD06FF);\n 511 |   color: white;\n 512 |   padding: 20px 0;\n 513 |   position: fixed;\n 514 |   height: 100vh;\n 515 |   overflow-y: auto;\n 516 | }\n 517 | \n 518 | .admin-sidebar__title {\n 519 |   padding: 0 20px 30px;\n 520 |   font-size: 24px;\n 521 |   font-weight: bold;\n 522 |   border-bottom: 1px solid rgba(255, 255, 255, 0.2);\n 523 | }\n 524 | \n 525 | .admin-nav {\n 526 |   padding: 20px 0;\n 527 | }\n 528 | \n 529 | .admin-nav__item {\n 530 |   display: block;\n 531 |   padding: 12px 20px;\n 532 |   color: white;\n 533 |   text-decoration: none;\n 534 |   transition: background-color 0.2s;\n 535 | }\n 536 | \n 537 | .admin-nav__item:hover,\n 538 | .admin-nav__item--active {\n 539 |   background-color: rgba(255, 255, 255, 0.1);\n 540 | }\n 541 | \n 542 | .admin-content {\n 543 |   margin-left: 250px;\n 544 |   flex: 1;\n 545 |   padding: 30px;\n 546 | }\n 547 | \n 548 | .admin-header {\n 549 |   background: white;\n 550 |   padding: 20px;\n 551 |   border-radius: 8px;\n 552 |   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n 553 |   margin-bottom: 30px;\n 554 | }\n 555 | \n 556 | .admin-header__title {\n 557 |   font-size: 28px;\n 558 |   color: #6C0287;\n 559 |   margin-bottom: 5px;\n 560 | }\n 561 | \n 562 | .admin-header__subtitle {\n 563 |   color: #666;\n 564 |   font-size: 14px;\n 565 | }\n 566 | \n 567 | .admin-card {\n 568 |   background: white;\n 569 |   border-radius: 8px;\n 570 |   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n 571 |   overflow: hidden;\n 572 |   margin-bottom: 20px;\n 573 | }\n 574 | \n 575 | .admin-card__header {\n 576 |   padding: 20px;\n 577 |   background: #f8f9fa;\n 578 |   border-bottom: 1px solid #eee;\n 579 |   display: flex;\n 580 |   justify-content: space-between;\n 581 |   align-items: center;\n 582 | }\n 583 | \n 584 | .admin-card__title {\n 585 |   font-size: 18px;\n 586 |   font-weight: 600;\n 587 | }\n 588 | \n 589 | .admin-card__content {\n 590 |   padding: 20px;\n 591 | }\n 592 | \n 593 | .admin-table {\n 594 |   width: 100%;\n 595 |   border-collapse: collapse;\n 596 | }\n 597 | \n 598 | .admin-table th,\n 599 | .admin-table td {\n 600 |   padding: 12px;\n 601 |   text-align: left;\n 602 |   border-bottom: 1px solid #eee;\n 603 | }\n 604 | \n 605 | .admin-table th {\n 606 |   background: #f8f9fa;\n 607 |   font-weight: 600;\n 608 |   color: #666;\n 609 |   font-size: 14px;\n 610 | }\n 611 | \n 612 | .admin-table td {\n 613 |   font-size: 14px;\n 614 | }\n 615 | \n 616 | .btn {\n 617 |   display: inline-block;\n 618 |   padding: 8px 16px;\n 619 |   border: none;\n 620 |   border-radius: 4px;\n 621 |   text-decoration: none;\n 622 |   font-size: 14px;\n 623 |   font-weight: 500;\n 624 |   cursor: pointer;\n 625 |   transition: all 0.2s;\n 626 |   text-align: center;\n 627 | }\n 628 | \n 629 | .btn--primary {\n 630 |   background: #6C0287;\n 631 |   color: white;\n 632 | }\n 633 | \n 634 | .btn--primary:hover {\n 635 |   background: #5a0270;\n 636 | }\n 637 | \n 638 | .btn--secondary {\n 639 |   background: #6c757d;\n 640 |   color: white;\n 641 | }\n 642 | \n 643 | .btn--success {\n 644 |   background: #28a745;\n 645 |   color: white;\n 646 | }\n 647 | \n 648 | .btn--danger {\n 649 |   background: #dc3545;\n 650 |   color: white;\n 651 | }\n 652 | \n 653 | .btn--small {\n 654 |   padding: 4px 8px;\n 655 |   font-size: 12px;\n 656 | }\n 657 | \n 658 | .badge {\n 659 |   display: inline-block;\n 660 |   padding: 4px 8px;\n 661 |   border-radius: 12px;\n 662 |   font-size: 12px;\n 663 |   font-weight: 500;\n 664 | }\n 665 | \n 666 | .badge--success {\n 667 |   background: #d4edda;\n 668 |   color: #155724;\n 669 | }\n 670 | \n 671 | .badge--danger {\n 672 |   background: #f8d7da;\n 673 |   color: #721c24;\n 674 | }\n 675 | \n 676 | .alert {\n 677 |   padding: 15px;\n 678 |   border-radius: 4px;\n 679 |   margin-bottom: 20px;\n 680 | }\n 681 | \n 682 | .alert--success {\n 683 |   background: #d4edda;\n 684 |   color: #155724;\n 685 |   border: 1px solid #c3e6cb;\n 686 | }\n 687 | \n 688 | .stats-grid {\n 689 |   display: grid;\n 690 |   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n 691 |   gap: 20px;\n 692 |   margin-bottom: 30px;\n 693 | }\n 694 | \n 695 | .stat-card {\n 696 |   background: white;\n 697 |   padding: 20px;\n 698 |   border-radius: 8px;\n 699 |   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n 700 |   text-align: center;\n 701 | }\n 702 | \n 703 | .stat-card__number {\n 704 |   font-size: 32px;\n 705 |   font-weight: bold;\n 706 |   color: #6C0287;\n 707 |   margin-bottom: 5px;\n 708 | }\n 709 | \n 710 | .stat-card__label {\n 711 |   color: #666;\n 712 |   font-size: 14px;\n 713 | }\n 714 | \n 715 | .form-group {\n 716 |   margin-bottom: 20px;\n 717 | }\n 718 | \n 719 | .form-label {\n 720 |   display: block;\n 721 |   margin-bottom: 5px;\n 722 |   font-weight: 500;\n 723 |   color: #333;\n 724 | }\n 725 | \n 726 | .form-input {\n 727 |   width: 100%;\n 728 |   padding: 10px;\n 729 |   border: 1px solid #ddd;\n 730 |   border-radius: 4px;\n 731 |   font-size: 14px;\n 732 | }\n 733 | \n 734 | .form-input:focus {\n 735 |   outline: none;\n 736 |   border-color: #6C0287;\n 737 |   box-shadow: 0 0 0 2px rgba(108, 2, 135, 0.1);\n 738 | }\n 739 | \n 740 | .pagination {\n 741 |   display: flex;\n 742 |   justify-content: center;\n 743 |   margin-top: 20px;\n 744 | }\n 745 | \n 746 | .pagination a,\n 747 | .pagination span {\n 748 |   padding: 8px 12px;\n 749 |   margin: 0 2px;\n 750 |   border: 1px solid #ddd;\n 751 |   border-radius: 4px;\n 752 |   color: #666;\n 753 |   text-decoration: none;\n 754 | }\n 755 | \n 756 | .pagination .current {\n 757 |   background: #6C0287;\n 758 |   color: white;\n 759 |   border-color: #6C0287;\n 760 | }\n 761 | \n 762 | .header {\n 763 |   padding: 30px 0 0 0;\n 764 | }\n 765 | .header.sticky {\n 766 |   position: fixed;\n 767 |   background: var(--main-background-color, #1B1A1B);\n 768 |   top: 0;\n 769 |   width: 100%;\n 770 |   z-index: 111;\n 771 |   padding: 30px 0 30px 0;\n 772 |   animation: slideDown 0.6s forwards;\n 773 | }\n 774 | .header_zindex {\n 775 |   z-index: 99;\n 776 | }\n 777 | \n 778 | .header__container {\n 779 |   display: flex;\n 780 |   justify-content: space-between;\n 781 |   align-items: center;\n 782 | }\n 783 | \n 784 | .header__navigation_open {\n 785 |   display: block;\n 786 | }\n 787 | \n 788 | .header__burger {\n 789 |   display: none;\n 790 | }\n 791 | \n 792 | .header__list {\n 793 |   display: flex;\n 794 |   justify-content: center;\n 795 |   align-items: center;\n 796 |   gap: 40px;\n 797 | }\n 798 | \n 799 | .header__link-menu {\n 800 |   text-transform: uppercase;\n 801 |   font-weight: 400;\n 802 |   font-size: 22px;\n 803 |   transition: color 0.4s ease;\n 804 | }\n 805 | .header__link-menu:hover {\n 806 |   color: var(--neon-purple, #CD06FF);\n 807 | }\n 808 | \n 809 | .header__callback {\n 810 |   width: 280px;\n 811 |   height: 55px;\n 812 |   border: 3px solid var(--neon-purple, #CD06FF);\n 813 |   border-radius: 10px;\n 814 |   background-color: transparent;\n 815 |   font-weight: 700;\n 816 |   font-size: 22px;\n 817 |   line-height: 30px;\n 818 |   text-transform: uppercase;\n 819 |   color: var(--main-text-color, #FFFFFF);\n 820 |   cursor: pointer;\n 821 |   transition: background-color 0.4s ease;\n 822 | }\n 823 | .header__callback:hover {\n 824 |   background-color: var(--dark-purple, #6C0287);\n 825 |   border: 3px solid var(--dark-purple, #6C0287);\n 826 |   border-radius: 10px;\n 827 |   color: var(--main-text-color, #FFFFFF);\n 828 | }\n 829 | .header__callback:focus {\n 830 |   background-color: var(--dark-purple, #6C0287);\n 831 |   border-radius: 10px;\n 832 |   border: none;\n 833 |   color: var(--main-text-color, #FFFFFF);\n 834 | }\n 835 | .header__callback:active {\n 836 |   background-color: var(--cold-purple, #640AA3);\n 837 |   border: 1px solid var(--black-color, #000000);\n 838 |   border-radius: 10px;\n 839 |   color: var(--main-text-color, #FFFFFF);\n 840 | }\n 841 | .header__callback_visible {\n 842 |   display: block;\n 843 |   position: absolute;\n 844 |   top: calc(100% + 318px);\n 845 |   left: 50%;\n 846 |   transform: translateX(-50%);\n 847 |   z-index: 99;\n 848 | }\n 849 | \n 850 | @keyframes slideDown {\n 851 |   from {\n 852 |     transform: translateY(-100%);\n 853 |   }\n 854 |   to {\n 855 |     transform: translateY(0);\n 856 |   }\n 857 | }\n 858 | .mobile-overlay {\n 859 |   position: fixed;\n 860 |   top: 0;\n 861 |   left: 0;\n 862 |   right: 0;\n 863 |   bottom: 0;\n 864 |   background-color: var(--main-background-color, #1B1A1B);\n 865 |   opacity: 0.6;\n 866 |   z-index: 1;\n 867 | }\n 868 | \n 869 | @media screen and (max-width: 1320px) {\n 870 |   .header {\n 871 |     padding: 30px 60px 0 60px;\n 872 |   }\n 873 |   .header.sticky {\n 874 |     padding: 30px 60px;\n 875 |   }\n 876 |   .header__list {\n 877 |     gap: 20px;\n 878 |   }\n 879 |   .header__link-menu {\n 880 |     font-size: 18px;\n 881 |   }\n 882 | }\n 883 | @media screen and (max-width: 1023px) {\n 884 |   .header {\n 885 |     padding: 30px 40px 0 40px;\n 886 |     position: relative;\n 887 |   }\n 888 |   .header.sticky {\n 889 |     padding: 30px 40px;\n 890 |   }\n 891 |   .header__logo {\n 892 |     width: 87px;\n 893 |     height: 55px;\n 894 |   }\n 895 |   .header__navigation {\n 896 |     position: absolute;\n 897 |     top: 100%;\n 898 |     left: 0;\n 899 |     right: 0;\n 900 |     display: none;\n 901 |     color: var(--main-text-color, #FFFFFF);\n 902 |     background-color: var(--main-background-color, #1B1A1B);\n 903 |     padding: 45px;\n 904 |     z-index: 1;\n 905 |   }\n 906 |   .header__list {\n 907 |     display: flex;\n 908 |     flex-direction: column;\n 909 |     align-items: center;\n 910 |   }\n 911 |   .header__item {\n 912 |     margin-bottom: 10px;\n 913 |     text-transform: uppercase;\n 914 |     font-weight: bold;\n 915 |   }\n 916 |   .header__callback {\n 917 |     width: 229px;\n 918 |     height: 45px;\n 919 |     font-size: 18px;\n 920 |     line-height: 24px;\n 921 |   }\n 922 | }\n 923 | @media screen and (max-width: 767px) {\n 924 |   .header {\n 925 |     padding: 20px 20px 0 20px;\n 926 |   }\n 927 |   .header.sticky {\n 928 |     padding: 20px 20px;\n 929 |   }\n 930 |   .header__burger {\n 931 |     display: block;\n 932 |   }\n 933 |   .header__logo {\n 934 |     width: 66px;\n 935 |     height: 42px;\n 936 |   }\n 937 |   .header__link-menu {\n 938 |     font-size: 14px;\n 939 |   }\n 940 |   .header__callback {\n 941 |     display: none;\n 942 |     width: 184px;\n 943 |     height: 37px;\n 944 |     font-size: 14px;\n 945 |     line-height: 24px;\n 946 |   }\n 947 |   .header__callback_visible {\n 948 |     display: block;\n 949 |     position: absolute;\n 950 |     top: calc(100% + 318px);\n 951 |     left: 50%;\n 952 |     transform: translateX(-50%);\n 953 |     z-index: 99;\n 954 |   }\n 955 |   .header__navigation {\n 956 |     padding: 45px 45px 100px 45px;\n 957 |   }\n 958 | }\n 959 | .footer {\n 960 |   position: relative;\n 961 |   overflow: hidden;\n 962 | }\n 963 | \n 964 | .footer__contacts {\n 965 |   padding: 100px 0 80px 0;\n 966 |   position: relative;\n 967 |   z-index: 2;\n 968 | }\n 969 | \n 970 | .footer__title {\n 971 |   text-align: center;\n 972 |   margin-bottom: 80px;\n 973 |   position: relative;\n 974 |   z-index: 2;\n 975 |   opacity: 0;\n 976 |   animation: titleFadeIn 1s ease-out forwards;\n 977 | }\n 978 | .footer__title::after {\n 979 |   content: \"\";\n 980 |   position: absolute;\n 981 |   bottom: -15px;\n 982 |   left: 50%;\n 983 |   transform: translateX(-50%);\n 984 |   width: 80px;\n 985 |   height: 3px;\n 986 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n 987 |   border-radius: 2px;\n 988 |   animation: lineExpand 1s ease-out 0.5s forwards;\n 989 |   scale: 0 1;\n 990 | }\n 991 | \n 992 | .footer__content {\n 993 |   display: grid;\n 994 |   grid-template-columns: 1fr 1fr;\n 995 |   gap: 80px;\n 996 |   align-items: start;\n 997 |   position: relative;\n 998 |   z-index: 2;\n 999 |   opacity: 0;\n1000 |   animation: contentSlideIn 1s ease-out 0.3s forwards;\n1001 | }\n1002 | \n1003 | .footer__info {\n1004 |   display: flex;\n1005 |   flex-direction: column;\n1006 |   gap: 50px;\n1007 | }\n1008 | \n1009 | .footer__address {\n1010 |   display: flex;\n1011 |   flex-direction: column;\n1012 |   gap: 30px;\n1013 |   font-style: normal;\n1014 | }\n1015 | \n1016 | .footer__detail {\n1017 |   display: flex;\n1018 |   align-items: flex-start;\n1019 |   gap: 20px;\n1020 |   transition: all 0.3s ease;\n1021 |   padding: 20px;\n1022 |   border-radius: 15px;\n1023 |   background: rgba(255, 255, 255, 0.05);\n1024 |   backdrop-filter: blur(10px);\n1025 |   border: 1px solid rgba(255, 255, 255, 0.1);\n1026 | }\n1027 | .footer__detail:hover {\n1028 |   transform: translateX(10px);\n1029 |   background: rgba(255, 255, 255, 0.08);\n1030 |   border-color: rgba(205, 6, 255, 0.3);\n1031 |   box-shadow: 0 10px 30px rgba(205, 6, 255, 0.2);\n1032 | }\n1033 | .footer__detail:hover .footer__icon {\n1034 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n1035 |   color: #FFFFFF;\n1036 |   transform: scale(1.1);\n1037 | }\n1038 | \n1039 | .footer__icon {\n1040 |   width: 50px;\n1041 |   height: 50px;\n1042 |   min-width: 50px;\n1043 |   background: rgba(255, 255, 255, 0.1);\n1044 |   border-radius: 50%;\n1045 |   display: flex;\n1046 |   align-items: center;\n1047 |   justify-content: center;\n1048 |   color: rgba(255, 255, 255, 0.8);\n1049 |   transition: all 0.3s ease;\n1050 | }\n1051 | .footer__icon svg {\n1052 |   width: 24px;\n1053 |   height: 24px;\n1054 | }\n1055 | \n1056 | .footer__text {\n1057 |   display: flex;\n1058 |   flex-direction: column;\n1059 |   gap: 5px;\n1060 | }\n1061 | \n1062 | .footer__city {\n1063 |   font-size: 18px;\n1064 |   font-weight: 600;\n1065 |   color: #FFFFFF;\n1066 | }\n1067 | \n1068 | .footer__street {\n1069 |   font-size: 16px;\n1070 |   color: rgba(255, 255, 255, 0.8);\n1071 | }\n1072 | \n1073 | .footer__link {\n1074 |   font-size: 18px;\n1075 |   font-weight: 500;\n1076 |   color: #FFFFFF;\n1077 |   text-decoration: none;\n1078 |   transition: color 0.3s ease;\n1079 |   display: flex;\n1080 |   align-items: center;\n1081 |   min-height: 50px;\n1082 | }\n1083 | .footer__link:hover {\n1084 |   color: var(--neon-purple, #CD06FF);\n1085 | }\n1086 | \n1087 | .footer__social {\n1088 |   display: flex;\n1089 |   gap: 20px;\n1090 |   flex-wrap: wrap;\n1091 |   justify-content: center;\n1092 | }\n1093 | \n1094 | .footer__social-item {\n1095 |   opacity: 0;\n1096 |   animation: socialItemAppear 0.6s ease-out forwards;\n1097 | }\n1098 | .footer__social-item:nth-child(1) {\n1099 |   animation-delay: 0.6s;\n1100 | }\n1101 | .footer__social-item:nth-child(2) {\n1102 |   animation-delay: 0.7s;\n1103 | }\n1104 | .footer__social-item:nth-child(3) {\n1105 |   animation-delay: 0.8s;\n1106 | }\n1107 | .footer__social-item:nth-child(4) {\n1108 |   animation-delay: 0.9s;\n1109 | }\n1110 | \n1111 | .footer__social-link {\n1112 |   width: 60px;\n1113 |   height: 60px;\n1114 |   background: rgba(255, 255, 255, 0.1);\n1115 |   border-radius: 50%;\n1116 |   display: flex;\n1117 |   align-items: center;\n1118 |   justify-content: center;\n1119 |   color: rgba(255, 255, 255, 0.8);\n1120 |   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n1121 |   text-decoration: none;\n1122 |   position: relative;\n1123 |   overflow: hidden;\n1124 | }\n1125 | .footer__social-link::before {\n1126 |   content: \"\";\n1127 |   position: absolute;\n1128 |   top: 0;\n1129 |   left: 0;\n1130 |   right: 0;\n1131 |   bottom: 0;\n1132 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n1133 |   opacity: 0;\n1134 |   transition: opacity 0.3s ease;\n1135 |   border-radius: 50%;\n1136 | }\n1137 | .footer__social-link svg {\n1138 |   width: 28px;\n1139 |   height: 28px;\n1140 |   position: relative;\n1141 |   z-index: 1;\n1142 |   transition: transform 0.3s ease;\n1143 | }\n1144 | .footer__social-link:hover {\n1145 |   transform: translateY(-8px) scale(1.1);\n1146 |   box-shadow: 0 15px 35px rgba(205, 6, 255, 0.4);\n1147 |   color: #FFFFFF;\n1148 | }\n1149 | .footer__social-link:hover::before {\n1150 |   opacity: 1;\n1151 | }\n1152 | .footer__social-link:hover svg {\n1153 |   transform: scale(1.1);\n1154 | }\n1155 | .footer__social-link--vk:hover {\n1156 |   box-shadow: 0 15px 35px rgba(70, 130, 180, 0.4);\n1157 | }\n1158 | .footer__social-link--vk:hover::before {\n1159 |   background: linear-gradient(45deg, #4682B4, #5A9BD4);\n1160 | }\n1161 | .footer__social-link--telegram:hover {\n1162 |   box-shadow: 0 15px 35px rgba(46, 134, 193, 0.4);\n1163 | }\n1164 | .footer__social-link--telegram:hover::before {\n1165 |   background: linear-gradient(45deg, #2E86C1, #3498DB);\n1166 | }\n1167 | .footer__social-link--pinterest:hover {\n1168 |   box-shadow: 0 15px 35px rgba(189, 8, 28, 0.4);\n1169 | }\n1170 | .footer__social-link--pinterest:hover::before {\n1171 |   background: linear-gradient(45deg, #BD081C, #E74C3C);\n1172 | }\n1173 | .footer__social-link--other:hover {\n1174 |   box-shadow: 0 15px 35px rgba(52, 152, 219, 0.4);\n1175 | }\n1176 | .footer__social-link--other:hover::before {\n1177 |   background: linear-gradient(45deg, #3498DB, #5DADE2);\n1178 | }\n1179 | \n1180 | .footer__map {\n1181 |   position: relative;\n1182 |   border-radius: 25px;\n1183 |   overflow: hidden;\n1184 |   box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);\n1185 |   background: rgba(255, 255, 255, 0.05);\n1186 |   backdrop-filter: blur(10px);\n1187 |   border: 1px solid rgba(255, 255, 255, 0.1);\n1188 |   height: 400px;\n1189 | }\n1190 | .footer__map::before {\n1191 |   content: \"\";\n1192 |   position: absolute;\n1193 |   top: 0;\n1194 |   left: 0;\n1195 |   right: 0;\n1196 |   bottom: 0;\n1197 |   background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\n1198 |   opacity: 0;\n1199 |   transition: opacity 0.3s ease;\n1200 |   z-index: 2;\n1201 |   pointer-events: none;\n1202 | }\n1203 | .footer__map:hover::before {\n1204 |   opacity: 1;\n1205 | }\n1206 | \n1207 | .footer__iframe {\n1208 |   width: 100%;\n1209 |   height: 100%;\n1210 |   border: none;\n1211 |   border-radius: 25px;\n1212 |   filter: grayscale(1) contrast(1.2) brightness(0.8);\n1213 |   transition: filter 0.3s ease;\n1214 | }\n1215 | .footer__iframe:hover {\n1216 |   filter: grayscale(0) contrast(1) brightness(1);\n1217 | }\n1218 | \n1219 | .footer__copyright {\n1220 |   background: rgba(0, 0, 0, 0.3);\n1221 |   backdrop-filter: blur(20px);\n1222 |   border-top: 1px solid rgba(255, 255, 255, 0.1);\n1223 |   padding: 30px 0;\n1224 |   position: relative;\n1225 |   z-index: 2;\n1226 | }\n1227 | \n1228 | .footer__copyright-content {\n1229 |   display: flex;\n1230 |   justify-content: space-between;\n1231 |   align-items: center;\n1232 |   flex-wrap: wrap;\n1233 |   gap: 20px;\n1234 | }\n1235 | \n1236 | .footer__copyright-text {\n1237 |   font-size: 14px;\n1238 |   color: rgba(255, 255, 255, 0.7);\n1239 |   margin: 0;\n1240 | }\n1241 | \n1242 | .footer__designer-link {\n1243 |   color: var(--neon-purple, #CD06FF);\n1244 |   text-decoration: none;\n1245 |   transition: all 0.3s ease;\n1246 |   position: relative;\n1247 | }\n1248 | .footer__designer-link::after {\n1249 |   content: \"\";\n1250 |   position: absolute;\n1251 |   bottom: -2px;\n1252 |   left: 0;\n1253 |   width: 0;\n1254 |   height: 1px;\n1255 |   background: var(--neon-purple, #CD06FF);\n1256 |   transition: width 0.3s ease;\n1257 | }\n1258 | .footer__designer-link:hover {\n1259 |   color: #FFFFFF;\n1260 |   text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\n1261 | }\n1262 | .footer__designer-link:hover::after {\n1263 |   width: 100%;\n1264 | }\n1265 | \n1266 | @keyframes dotsMove {\n1267 |   0% {\n1268 |     transform: translate(0, 0);\n1269 |   }\n1270 |   100% {\n1271 |     transform: translate(60px, 60px);\n1272 |   }\n1273 | }\n1274 | @keyframes titleFadeIn {\n1275 |   from {\n1276 |     opacity: 0;\n1277 |     transform: translateY(-30px);\n1278 |   }\n1279 |   to {\n1280 |     opacity: 1;\n1281 |     transform: translateY(0);\n1282 |   }\n1283 | }\n1284 | @keyframes lineExpand {\n1285 |   from {\n1286 |     scale: 0 1;\n1287 |   }\n1288 |   to {\n1289 |     scale: 1 1;\n1290 |   }\n1291 | }\n1292 | @keyframes contentSlideIn {\n1293 |   from {\n1294 |     opacity: 0;\n1295 |     transform: translateY(50px);\n1296 |   }\n1297 |   to {\n1298 |     opacity: 1;\n1299 |     transform: translateY(0);\n1300 |   }\n1301 | }\n1302 | @keyframes socialItemAppear {\n1303 |   from {\n1304 |     opacity: 0;\n1305 |     transform: translateY(20px) scale(0.8);\n1306 |   }\n1307 |   to {\n1308 |     opacity: 1;\n1309 |     transform: translateY(0) scale(1);\n1310 |   }\n1311 | }\n1312 | @media screen and (max-width: 1023px) {\n1313 |   .footer__contacts {\n1314 |     padding: 70px 0 60px 0;\n1315 |   }\n1316 |   .footer__title {\n1317 |     margin-bottom: 60px;\n1318 |   }\n1319 |   .footer__content {\n1320 |     grid-template-columns: 1fr;\n1321 |     gap: 60px;\n1322 |   }\n1323 |   .footer__map {\n1324 |     height: 300px;\n1325 |   }\n1326 | }\n1327 | @media screen and (max-width: 767px) {\n1328 |   .footer__contacts {\n1329 |     padding: 50px 0 40px 0;\n1330 |   }\n1331 |   .footer__title {\n1332 |     margin-bottom: 40px;\n1333 |   }\n1334 |   .footer__content {\n1335 |     gap: 40px;\n1336 |   }\n1337 |   .footer__info {\n1338 |     gap: 30px;\n1339 |   }\n1340 |   .footer__address {\n1341 |     gap: 20px;\n1342 |   }\n1343 |   .footer__detail {\n1344 |     padding: 15px;\n1345 |     gap: 15px;\n1346 |   }\n1347 |   .footer__icon {\n1348 |     width: 40px;\n1349 |     height: 40px;\n1350 |     min-width: 40px;\n1351 |   }\n1352 |   .footer__icon svg {\n1353 |     width: 20px;\n1354 |     height: 20px;\n1355 |   }\n1356 |   .footer__city {\n1357 |     font-size: 16px;\n1358 |   }\n1359 |   .footer__street,\n1360 |   .footer__link {\n1361 |     font-size: 14px;\n1362 |   }\n1363 |   .footer__social {\n1364 |     gap: 15px;\n1365 |   }\n1366 |   .footer__social-link {\n1367 |     width: 50px;\n1368 |     height: 50px;\n1369 |   }\n1370 |   .footer__social-link svg {\n1371 |     width: 24px;\n1372 |     height: 24px;\n1373 |   }\n1374 |   .footer__map {\n1375 |     height: 250px;\n1376 |     border-radius: 20px;\n1377 |   }\n1378 |   .footer__copyright {\n1379 |     padding: 20px 0;\n1380 |   }\n1381 |   .footer__copyright-content {\n1382 |     flex-direction: column;\n1383 |     text-align: center;\n1384 |     gap: 10px;\n1385 |   }\n1386 |   .footer__copyright-text {\n1387 |     font-size: 12px;\n1388 |   }\n1389 | }\n1390 | .about-us {\n1391 |   padding: 100px 0;\n1392 |   position: relative;\n1393 |   overflow: hidden;\n1394 | }\n1395 | .about-us::before {\n1396 |   content: \"\";\n1397 |   position: absolute;\n1398 |   top: 0;\n1399 |   left: 0;\n1400 |   right: 0;\n1401 |   bottom: 0;\n1402 |   opacity: 0.5;\n1403 |   animation: patternMove 10s linear infinite;\n1404 | }\n1405 | \n1406 | .about-us__content {\n1407 |   display: grid;\n1408 |   grid-template-columns: 1fr 400px;\n1409 |   grid-template-rows: auto auto;\n1410 |   gap: 60px 80px;\n1411 |   align-items: start;\n1412 |   position: relative;\n1413 |   z-index: 2;\n1414 | }\n1415 | \n1416 | .about-us__gallery {\n1417 |   grid-column: 1/2;\n1418 |   grid-row: 1/3;\n1419 |   display: grid;\n1420 |   grid-template-columns: repeat(13, 1fr);\n1421 |   grid-template-rows: repeat(3, auto);\n1422 |   gap: 10px;\n1423 |   opacity: 0;\n1424 |   animation: galleryAppear 1s ease-out 0.3s forwards;\n1425 | }\n1426 | \n1427 | .about-us__gallery-item {\n1428 |   position: relative;\n1429 |   border-radius: 15px;\n1430 |   overflow: hidden;\n1431 |   cursor: pointer;\n1432 |   transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n1433 |   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n1434 | }\n1435 | .about-us__gallery-item::before {\n1436 |   content: \"\";\n1437 |   position: absolute;\n1438 |   top: 0;\n1439 |   left: 0;\n1440 |   right: 0;\n1441 |   bottom: 0;\n1442 |   background: linear-gradient(135deg, rgba(205, 6, 255, 0.2) 0%, rgba(255, 6, 205, 0.2) 100%);\n1443 |   opacity: 0;\n1444 |   transition: opacity 0.3s ease;\n1445 |   z-index: 2;\n1446 | }\n1447 | .about-us__gallery-item::after {\n1448 |   content: \"\";\n1449 |   position: absolute;\n1450 |   top: 50%;\n1451 |   left: 50%;\n1452 |   transform: translate(-50%, -50%);\n1453 |   width: 50px;\n1454 |   height: 50px;\n1455 |   background: rgba(255, 255, 255, 0.9);\n1456 |   border-radius: 50%;\n1457 |   display: flex;\n1458 |   align-items: center;\n1459 |   justify-content: center;\n1460 |   opacity: 0;\n1461 |   transition: all 0.3s ease;\n1462 |   z-index: 3;\n1463 |   font-size: 20px;\n1464 |   color: #1b1a1b;\n1465 | }\n1466 | .about-us__gallery-item:hover {\n1467 |   transform: translateY(-10px) scale(1.05);\n1468 |   box-shadow: 0 20px 40px rgba(205, 6, 255, 0.4);\n1469 | }\n1470 | .about-us__gallery-item:hover::before {\n1471 |   opacity: 1;\n1472 | }\n1473 | .about-us__gallery-item:hover::after {\n1474 |   opacity: 1;\n1475 |   content: \"🎮\";\n1476 | }\n1477 | .about-us__gallery-item:hover .about-us__image {\n1478 |   transform: scale(1.1);\n1479 |   filter: brightness(1.2);\n1480 | }\n1481 | .about-us__gallery-item:nth-child(1) {\n1482 |   animation: itemFloat 1s ease-out 0.1s forwards;\n1483 |   transform: translateY(50px);\n1484 | }\n1485 | .about-us__gallery-item:nth-child(2) {\n1486 |   animation: itemFloat 1s ease-out 0.2s forwards;\n1487 |   transform: translateY(50px);\n1488 | }\n1489 | .about-us__gallery-item:nth-child(3) {\n1490 |   animation: itemFloat 1s ease-out 0.3s forwards;\n1491 |   transform: translateY(50px);\n1492 | }\n1493 | .about-us__gallery-item:nth-child(4) {\n1494 |   animation: itemFloat 1s ease-out 0.4s forwards;\n1495 |   transform: translateY(50px);\n1496 | }\n1497 | .about-us__gallery-item:nth-child(5) {\n1498 |   animation: itemFloat 1s ease-out 0.5s forwards;\n1499 |   transform: translateY(50px);\n1500 | }\n1501 | .about-us__gallery-item:nth-child(6) {\n1502 |   animation: itemFloat 1s ease-out 0.6s forwards;\n1503 |   transform: translateY(50px);\n1504 | }\n1505 | .about-us__gallery-item:nth-child(7) {\n1506 |   animation: itemFloat 1s ease-out 0.7s forwards;\n1507 |   transform: translateY(50px);\n1508 | }\n1509 | .about-us__gallery-item--vr {\n1510 |   grid-row: 1/2;\n1511 |   grid-column: 1/7;\n1512 | }\n1513 | .about-us__gallery-item--games {\n1514 |   grid-row: 1/2;\n1515 |   grid-column: 7/13;\n1516 | }\n1517 | .about-us__gallery-item--fifa {\n1518 |   grid-row: 2/3;\n1519 |   grid-column: 1/4;\n1520 | }\n1521 | .about-us__gallery-item--pad {\n1522 |   grid-row: 2/3;\n1523 |   grid-column: 4/8;\n1524 | }\n1525 | .about-us__gallery-item--controller {\n1526 |   grid-row: 2/3;\n1527 |   grid-column: 8/13;\n1528 | }\n1529 | .about-us__gallery-item--karaoke {\n1530 |   grid-row: 3/4;\n1531 |   grid-column: 1/9;\n1532 | }\n1533 | .about-us__gallery-item--vr2 {\n1534 |   grid-row: 3/4;\n1535 |   grid-column: 9/13;\n1536 | }\n1537 | \n1538 | .about-us__image {\n1539 |   width: 100%;\n1540 |   height: 100%;\n1541 |   object-fit: cover;\n1542 |   transition: all 0.5s ease;\n1543 | }\n1544 | \n1545 | .about-us__text {\n1546 |   grid-column: 2/3;\n1547 |   grid-row: 1/2;\n1548 |   background: rgba(255, 255, 255, 0.05);\n1549 |   backdrop-filter: blur(10px);\n1550 |   border-radius: 20px;\n1551 |   padding: 40px;\n1552 |   border: 1px solid rgba(255, 255, 255, 0.1);\n1553 |   opacity: 0;\n1554 |   animation: textSlideIn 1s ease-out 0.6s forwards;\n1555 | }\n1556 | \n1557 | .about-us__description {\n1558 |   font-size: 18px;\n1559 |   line-height: 28px;\n1560 |   margin: 0 0 20px 0;\n1561 |   color: rgba(255, 255, 255, 0.9);\n1562 |   transition: color 0.3s ease;\n1563 | }\n1564 | .about-us__description:last-child {\n1565 |   margin: 0;\n1566 | }\n1567 | .about-us__description:hover {\n1568 |   color: #FFFFFF;\n1569 | }\n1570 | \n1571 | .about-us__quote {\n1572 |   grid-column: 2/3;\n1573 |   grid-row: 2/3;\n1574 |   background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\n1575 |   backdrop-filter: blur(15px);\n1576 |   border-radius: 25px;\n1577 |   padding: 40px;\n1578 |   border: 2px solid rgba(205, 6, 255, 0.2);\n1579 |   position: relative;\n1580 |   opacity: 0;\n1581 |   animation: quoteAppear 1s ease-out 0.9s forwards;\n1582 | }\n1583 | .about-us__quote::before {\n1584 |   content: '\"';\n1585 |   position: absolute;\n1586 |   top: -20px;\n1587 |   left: 30px;\n1588 |   font-size: 80px;\n1589 |   color: rgba(205, 6, 255, 0.3);\n1590 |   font-family: serif;\n1591 |   line-height: 1;\n1592 | }\n1593 | \n1594 | .about-us__quote-text {\n1595 |   font-size: 20px;\n1596 |   line-height: 30px;\n1597 |   margin: 0 0 30px 0;\n1598 |   font-style: italic;\n1599 |   color: #FFFFFF;\n1600 | }\n1601 | \n1602 | .about-us__quote-highlight {\n1603 |   color: var(--neon-purple, #CD06FF);\n1604 |   font-weight: 700;\n1605 |   text-transform: uppercase;\n1606 |   text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\n1607 | }\n1608 | \n1609 | .about-us__cite {\n1610 |   display: flex;\n1611 |   align-items: center;\n1612 |   gap: 15px;\n1613 |   font-style: normal;\n1614 | }\n1615 | \n1616 | .about-us__author-photo {\n1617 |   width: 60px;\n1618 |   height: 60px;\n1619 |   border-radius: 50%;\n1620 |   object-fit: cover;\n1621 |   border: 3px solid var(--neon-purple, #CD06FF);\n1622 |   box-shadow: 0 0 20px rgba(205, 6, 255, 0.3);\n1623 | }\n1624 | \n1625 | .about-us__author {\n1626 |   font-size: 16px;\n1627 |   color: rgba(255, 255, 255, 0.8);\n1628 |   line-height: 22px;\n1629 | }\n1630 | \n1631 | @keyframes patternMove {\n1632 |   0% {\n1633 |     transform: translateX(0);\n1634 |   }\n1635 |   100% {\n1636 |     transform: translateX(4px);\n1637 |   }\n1638 | }\n1639 | @keyframes titleAppear {\n1640 |   from {\n1641 |     opacity: 0;\n1642 |     transform: translateY(-30px);\n1643 |   }\n1644 |   to {\n1645 |     opacity: 1;\n1646 |     transform: translateY(0);\n1647 |   }\n1648 | }\n1649 | @keyframes lineExpand {\n1650 |   from {\n1651 |     scale: 0 1;\n1652 |   }\n1653 |   to {\n1654 |     scale: 1 1;\n1655 |   }\n1656 | }\n1657 | @keyframes galleryAppear {\n1658 |   from {\n1659 |     opacity: 0;\n1660 |     transform: translateX(-50px);\n1661 |   }\n1662 |   to {\n1663 |     opacity: 1;\n1664 |     transform: translateX(0);\n1665 |   }\n1666 | }\n1667 | @keyframes itemFloat {\n1668 |   from {\n1669 |     transform: translateY(50px);\n1670 |     opacity: 0;\n1671 |   }\n1672 |   to {\n1673 |     transform: translateY(0);\n1674 |     opacity: 1;\n1675 |   }\n1676 | }\n1677 | @keyframes textSlideIn {\n1678 |   from {\n1679 |     opacity: 0;\n1680 |     transform: translateX(50px);\n1681 |   }\n1682 |   to {\n1683 |     opacity: 1;\n1684 |     transform: translateX(0);\n1685 |   }\n1686 | }\n1687 | @keyframes quoteAppear {\n1688 |   from {\n1689 |     opacity: 0;\n1690 |     transform: translateY(30px) scale(0.95);\n1691 |   }\n1692 |   to {\n1693 |     opacity: 1;\n1694 |     transform: translateY(0) scale(1);\n1695 |   }\n1696 | }\n1697 | @media screen and (max-width: 1320px) {\n1698 |   .about-us {\n1699 |     padding: 70px 0;\n1700 |   }\n1701 |   .about-us__content {\n1702 |     grid-template-columns: 1fr 350px;\n1703 |     gap: 40px 60px;\n1704 |   }\n1705 |   .about-us__text {\n1706 |     padding: 30px;\n1707 |   }\n1708 |   .about-us__description {\n1709 |     font-size: 16px;\n1710 |     line-height: 24px;\n1711 |   }\n1712 |   .about-us__quote {\n1713 |     padding: 30px;\n1714 |   }\n1715 |   .about-us__quote-text {\n1716 |     font-size: 18px;\n1717 |     line-height: 26px;\n1718 |   }\n1719 | }\n1720 | @media screen and (max-width: 1023px) {\n1721 |   .about-us {\n1722 |     padding: 50px 0;\n1723 |   }\n1724 |   .about-us__content {\n1725 |     grid-template-columns: 400px 1fr;\n1726 |     grid-template-rows: auto auto auto;\n1727 |     gap: 30px;\n1728 |   }\n1729 |   .about-us__gallery {\n1730 |     grid-column: 1/2;\n1731 |     grid-row: 1/4;\n1732 |   }\n1733 |   .about-us__text {\n1734 |     grid-column: 2/3;\n1735 |     grid-row: 1/2;\n1736 |     padding: 25px;\n1737 |   }\n1738 |   .about-us__quote {\n1739 |     grid-column: 2/3;\n1740 |     grid-row: 2/3;\n1741 |     padding: 25px;\n1742 |   }\n1743 |   .about-us__description {\n1744 |     font-size: 14px;\n1745 |     line-height: 20px;\n1746 |   }\n1747 |   .about-us__quote-text {\n1748 |     font-size: 16px;\n1749 |     line-height: 22px;\n1750 |   }\n1751 | }\n1752 | @media screen and (max-width: 767px) {\n1753 |   .about-us {\n1754 |     padding: 30px 0;\n1755 |   }\n1756 |   .about-us__title {\n1757 |     margin-bottom: 40px;\n1758 |   }\n1759 |   .about-us__content {\n1760 |     grid-template-columns: 1fr;\n1761 |     grid-template-rows: auto auto auto;\n1762 |     gap: 30px;\n1763 |   }\n1764 |   .about-us__gallery {\n1765 |     grid-column: 1/2;\n1766 |     grid-row: 2/3;\n1767 |     max-width: 280px;\n1768 |     justify-self: center;\n1769 |   }\n1770 |   .about-us__text {\n1771 |     grid-column: 1/2;\n1772 |     grid-row: 1/2;\n1773 |     padding: 20px;\n1774 |   }\n1775 |   .about-us__quote {\n1776 |     grid-column: 1/2;\n1777 |     grid-row: 3/4;\n1778 |     padding: 20px;\n1779 |   }\n1780 |   .about-us__quote::before {\n1781 |     font-size: 60px;\n1782 |     top: -15px;\n1783 |     left: 20px;\n1784 |   }\n1785 |   .about-us__description {\n1786 |     font-size: 12px;\n1787 |     line-height: 16px;\n1788 |     margin: 0 0 15px 0;\n1789 |   }\n1790 |   .about-us__quote-text {\n1791 |     font-size: 14px;\n1792 |     line-height: 18px;\n1793 |     margin: 0 0 20px 0;\n1794 |   }\n1795 |   .about-us__author-photo {\n1796 |     width: 50px;\n1797 |     height: 50px;\n1798 |   }\n1799 |   .about-us__author {\n1800 |     font-size: 14px;\n1801 |     line-height: 18px;\n1802 |   }\n1803 | }\n1804 | .booking {\n1805 |   padding: 80px 0;\n1806 | }\n1807 | \n1808 | .booking__form {\n1809 |   max-width: 1200px;\n1810 |   margin: 0 auto;\n1811 | }\n1812 | \n1813 | .booking__fieldset {\n1814 |   border: none;\n1815 |   margin: 0 0 40px 0;\n1816 |   padding: 0;\n1817 | }\n1818 | .booking__fieldset--halls {\n1819 |   margin-bottom: 60px;\n1820 | }\n1821 | \n1822 | .booking__legend {\n1823 |   font-size: 32px;\n1824 |   font-weight: 600;\n1825 |   color: #FFFFFF;\n1826 |   margin-bottom: 30px;\n1827 |   text-align: center;\n1828 |   width: 100%;\n1829 | }\n1830 | \n1831 | .booking__halls {\n1832 |   display: grid;\n1833 |   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n1834 |   gap: 20px;\n1835 |   margin-bottom: 40px;\n1836 | }\n1837 | \n1838 | .booking__hall-label {\n1839 |   position: relative;\n1840 |   cursor: pointer;\n1841 |   display: block;\n1842 |   height: 200px;\n1843 |   border-radius: 15px;\n1844 |   overflow: hidden;\n1845 |   transition: all 0.3s ease;\n1846 | }\n1847 | .booking__hall-label:hover {\n1848 |   transform: translateY(-5px);\n1849 |   box-shadow: 0 15px 40px rgba(205, 6, 255, 0.3);\n1850 | }\n1851 | \n1852 | .booking__hall-input {\n1853 |   position: absolute;\n1854 |   opacity: 0;\n1855 |   pointer-events: none;\n1856 | }\n1857 | .booking__hall-input:checked + .booking__hall-visual {\n1858 |   border: 3px solid #CD06FF;\n1859 |   box-shadow: 0 0 30px rgba(205, 6, 255, 0.6);\n1860 |   transform: scale(1.02);\n1861 | }\n1862 | .booking__hall-input:checked + .booking__hall-visual::after {\n1863 |   opacity: 1;\n1864 | }\n1865 | .booking__hall-input--80s-vibes + .booking__hall-visual {\n1866 |   background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${___CSS_LOADER_URL_REPLACEMENT_4___});\n1867 |   background-size: cover;\n1868 |   background-position: center;\n1869 | }\n1870 | .booking__hall-input--star-wars + .booking__hall-visual {\n1871 |   background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${___CSS_LOADER_URL_REPLACEMENT_5___});\n1872 |   background-size: cover;\n1873 |   background-position: center;\n1874 | }\n1875 | .booking__hall-input--wild-west + .booking__hall-visual {\n1876 |   background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${___CSS_LOADER_URL_REPLACEMENT_6___});\n1877 |   background-size: cover;\n1878 |   background-position: center;\n1879 | }\n1880 | .booking__hall-input--neon-style + .booking__hall-visual {\n1881 |   background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${___CSS_LOADER_URL_REPLACEMENT_7___});\n1882 |   background-size: cover;\n1883 |   background-position: center;\n1884 | }\n1885 | \n1886 | .booking__hall-visual {\n1887 |   display: flex;\n1888 |   align-items: center;\n1889 |   justify-content: center;\n1890 |   height: 100%;\n1891 |   border: 2px solid transparent;\n1892 |   border-radius: 15px;\n1893 |   font-size: 24px;\n1894 |   font-weight: 700;\n1895 |   color: #FFFFFF;\n1896 |   text-transform: uppercase;\n1897 |   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\n1898 |   transition: all 0.3s ease;\n1899 |   position: relative;\n1900 | }\n1901 | .booking__hall-visual::after {\n1902 |   content: \"✓\";\n1903 |   position: absolute;\n1904 |   top: 15px;\n1905 |   right: 15px;\n1906 |   width: 30px;\n1907 |   height: 30px;\n1908 |   background: #CD06FF;\n1909 |   border-radius: 50%;\n1910 |   display: flex;\n1911 |   align-items: center;\n1912 |   justify-content: center;\n1913 |   font-size: 18px;\n1914 |   opacity: 0;\n1915 |   transition: opacity 0.3s ease;\n1916 | }\n1917 | \n1918 | .booking__content {\n1919 |   background: rgba(255, 255, 255, 0.05);\n1920 |   border-radius: 20px;\n1921 |   padding: 40px;\n1922 |   backdrop-filter: blur(10px);\n1923 |   border: 1px solid rgba(255, 255, 255, 0.1);\n1924 | }\n1925 | \n1926 | .booking__sub-fieldset {\n1927 |   border: none;\n1928 |   margin: 0 0 30px 0;\n1929 |   padding: 0;\n1930 | }\n1931 | \n1932 | .booking__sub-legend {\n1933 |   font-size: 20px;\n1934 |   font-weight: 500;\n1935 |   color: #FFFFFF;\n1936 |   margin-bottom: 15px;\n1937 | }\n1938 | \n1939 | .booking__options {\n1940 |   display: flex;\n1941 |   flex-wrap: wrap;\n1942 |   gap: 15px;\n1943 | }\n1944 | \n1945 | .booking__option-label {\n1946 |   position: relative;\n1947 |   cursor: pointer;\n1948 | }\n1949 | \n1950 | .booking__option-input {\n1951 |   position: absolute;\n1952 |   opacity: 0;\n1953 |   pointer-events: none;\n1954 | }\n1955 | .booking__option-input:checked + .booking__option-text {\n1956 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n1957 |   color: #FFFFFF;\n1958 |   transform: scale(1.05);\n1959 |   box-shadow: 0 5px 15px rgba(205, 6, 255, 0.4);\n1960 | }\n1961 | \n1962 | .booking__option-text {\n1963 |   display: block;\n1964 |   padding: 12px 20px;\n1965 |   background: rgba(255, 255, 255, 0.1);\n1966 |   border: 1px solid rgba(255, 255, 255, 0.2);\n1967 |   border-radius: 25px;\n1968 |   color: #FFFFFF;\n1969 |   font-size: 16px;\n1970 |   transition: all 0.3s ease;\n1971 | }\n1972 | .booking__option-text:hover {\n1973 |   background: rgba(255, 255, 255, 0.15);\n1974 |   transform: translateY(-2px);\n1975 | }\n1976 | \n1977 | .booking__fieldset--datetime {\n1978 |   margin-top: 40px;\n1979 | }\n1980 | \n1981 | .booking__datetime {\n1982 |   display: grid;\n1983 |   grid-template-columns: 1fr 1fr;\n1984 |   gap: 40px;\n1985 | }\n1986 | \n1987 | .booking__selects,\n1988 | .booking__inputs {\n1989 |   display: flex;\n1990 |   flex-direction: column;\n1991 |   gap: 20px;\n1992 | }\n1993 | \n1994 | .booking__select-label,\n1995 | .booking__input-label {\n1996 |   display: flex;\n1997 |   flex-direction: column;\n1998 |   gap: 8px;\n1999 | }\n2000 | \n2001 | .booking__input-text {\n2002 |   font-size: 16px;\n2003 |   color: #FFFFFF;\n2004 |   font-weight: 500;\n2005 | }\n2006 | \n2007 | .booking__select,\n2008 | .booking__input {\n2009 |   padding: 15px 20px;\n2010 |   background: rgba(255, 255, 255, 0.1);\n2011 |   border: 1px solid rgba(255, 255, 255, 0.2);\n2012 |   border-radius: 10px;\n2013 |   color: #FFFFFF;\n2014 |   font-size: 16px;\n2015 |   transition: all 0.3s ease;\n2016 | }\n2017 | .booking__select:focus,\n2018 | .booking__input:focus {\n2019 |   outline: none;\n2020 |   border-color: #CD06FF;\n2021 |   box-shadow: 0 0 15px rgba(205, 6, 255, 0.3);\n2022 |   background: rgba(255, 255, 255, 0.15);\n2023 | }\n2024 | .booking__select::placeholder,\n2025 | .booking__input::placeholder {\n2026 |   color: rgba(255, 255, 255, 0.6);\n2027 | }\n2028 | \n2029 | .booking__select {\n2030 |   cursor: pointer;\n2031 | }\n2032 | .booking__select option {\n2033 |   background: #1b1a1b;\n2034 |   color: #FFFFFF;\n2035 | }\n2036 | \n2037 | .booking__submit {\n2038 |   width: 100%;\n2039 |   max-width: 400px;\n2040 |   margin: 40px auto 0;\n2041 |   display: block;\n2042 |   padding: 18px 40px;\n2043 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2044 |   border: none;\n2045 |   border-radius: 50px;\n2046 |   color: #FFFFFF;\n2047 |   font-size: 20px;\n2048 |   font-weight: 700;\n2049 |   text-transform: uppercase;\n2050 |   cursor: pointer;\n2051 |   transition: all 0.3s ease;\n2052 |   position: relative;\n2053 |   overflow: hidden;\n2054 | }\n2055 | .booking__submit::before {\n2056 |   content: \"\";\n2057 |   position: absolute;\n2058 |   top: 0;\n2059 |   left: -100%;\n2060 |   width: 100%;\n2061 |   height: 100%;\n2062 |   background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);\n2063 |   transition: left 0.5s ease;\n2064 | }\n2065 | .booking__submit:hover {\n2066 |   transform: translateY(-3px);\n2067 |   box-shadow: 0 15px 40px rgba(205, 6, 255, 0.4);\n2068 | }\n2069 | .booking__submit:hover::before {\n2070 |   left: 100%;\n2071 | }\n2072 | .booking__submit:active {\n2073 |   transform: translateY(-1px);\n2074 | }\n2075 | \n2076 | .booking__message {\n2077 |   padding: 15px 20px;\n2078 |   margin-bottom: 20px;\n2079 |   border-radius: 5px;\n2080 | }\n2081 | .booking__message--success {\n2082 |   background-color: #4caf50;\n2083 |   color: white;\n2084 | }\n2085 | .booking__message--error {\n2086 |   background-color: #f44336;\n2087 |   color: white;\n2088 | }\n2089 | \n2090 | @keyframes glow {\n2091 |   from {\n2092 |     text-shadow: 0 0 20px rgba(205, 6, 255, 0.5);\n2093 |   }\n2094 |   to {\n2095 |     text-shadow: 0 0 30px rgba(205, 6, 255, 0.8), 0 0 40px rgba(255, 6, 205, 0.3);\n2096 |   }\n2097 | }\n2098 | @media screen and (max-width: 1023px) {\n2099 |   .booking {\n2100 |     padding: 60px 0;\n2101 |   }\n2102 |   .booking__title {\n2103 |     font-size: 36px;\n2104 |     margin-bottom: 40px;\n2105 |   }\n2106 |   .booking__content {\n2107 |     padding: 30px;\n2108 |   }\n2109 |   .booking__datetime {\n2110 |     grid-template-columns: 1fr;\n2111 |     gap: 30px;\n2112 |   }\n2113 |   .booking__halls {\n2114 |     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n2115 |   }\n2116 |   .booking__hall-visual {\n2117 |     font-size: 20px;\n2118 |   }\n2119 | }\n2120 | @media screen and (max-width: 767px) {\n2121 |   .booking {\n2122 |     padding: 40px 0;\n2123 |   }\n2124 |   .booking__title {\n2125 |     font-size: 28px;\n2126 |     margin-bottom: 30px;\n2127 |   }\n2128 |   .booking__legend {\n2129 |     font-size: 24px;\n2130 |     margin-bottom: 20px;\n2131 |   }\n2132 |   .booking__content {\n2133 |     padding: 20px;\n2134 |   }\n2135 |   .booking__halls {\n2136 |     grid-template-columns: 1fr;\n2137 |     gap: 15px;\n2138 |   }\n2139 |   .booking__hall-label {\n2140 |     height: 150px;\n2141 |   }\n2142 |   .booking__hall-visual {\n2143 |     font-size: 18px;\n2144 |   }\n2145 |   .booking__options {\n2146 |     gap: 10px;\n2147 |   }\n2148 |   .booking__option-text {\n2149 |     padding: 10px 16px;\n2150 |     font-size: 14px;\n2151 |   }\n2152 |   .booking__select,\n2153 |   .booking__input {\n2154 |     padding: 12px 16px;\n2155 |     font-size: 14px;\n2156 |   }\n2157 |   .booking__submit {\n2158 |     font-size: 18px;\n2159 |     padding: 15px 30px;\n2160 |   }\n2161 | }\n2162 | .entertainment {\n2163 |   padding: 80px 0;\n2164 |   position: relative;\n2165 | }\n2166 | \n2167 | .entertainment__list {\n2168 |   display: flex;\n2169 |   flex-wrap: wrap;\n2170 |   justify-content: center;\n2171 |   gap: 40px 20px;\n2172 |   align-items: flex-end;\n2173 |   margin: 0 0 70px 0;\n2174 |   position: relative;\n2175 |   z-index: 2;\n2176 | }\n2177 | \n2178 | .entertainment__item {\n2179 |   display: flex;\n2180 |   position: relative;\n2181 |   width: 380px;\n2182 |   height: 228px;\n2183 |   flex-basis: 380px;\n2184 |   border-radius: 20px;\n2185 |   overflow: hidden;\n2186 |   cursor: pointer;\n2187 |   transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n2188 |   background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);\n2189 |   backdrop-filter: blur(10px);\n2190 |   border: 1px solid rgba(255, 255, 255, 0.1);\n2191 |   opacity: 0;\n2192 |   transform: translateY(50px);\n2193 | }\n2194 | .entertainment__item::before {\n2195 |   content: \"\";\n2196 |   position: absolute;\n2197 |   top: 0;\n2198 |   left: 0;\n2199 |   right: 0;\n2200 |   bottom: 0;\n2201 |   background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(108, 2, 135, 0.1) 100%);\n2202 |   opacity: 0;\n2203 |   transition: opacity 0.3s ease;\n2204 |   z-index: 1;\n2205 | }\n2206 | .entertainment__item::after {\n2207 |   content: \"\";\n2208 |   position: absolute;\n2209 |   top: -50%;\n2210 |   left: -50%;\n2211 |   width: 200%;\n2212 |   height: 200%;\n2213 |   background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);\n2214 |   transform: rotate(45deg);\n2215 |   opacity: 0;\n2216 |   transition: all 0.6s ease;\n2217 |   z-index: 3;\n2218 | }\n2219 | .entertainment__item:hover {\n2220 |   transform: translateY(-15px) scale(1.05);\n2221 |   box-shadow: 0 25px 50px rgba(205, 6, 255, 0.2), 0 15px 30px rgba(108, 2, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2222 |   border-color: rgba(205, 6, 255, 0.3);\n2223 | }\n2224 | .entertainment__item:hover::before {\n2225 |   opacity: 1;\n2226 | }\n2227 | .entertainment__item:hover::after {\n2228 |   top: -100%;\n2229 |   left: -100%;\n2230 |   opacity: 1;\n2231 | }\n2232 | .entertainment__item:hover .entertainment__image {\n2233 |   transform: scale(1.1);\n2234 |   filter: brightness(1.2) saturate(1.3);\n2235 | }\n2236 | .entertainment__item:hover .entertainment__description {\n2237 |   text-shadow: 0 0 20px rgba(205, 6, 255, 0.8);\n2238 |   color: var(--neon-purple, #CD06FF);\n2239 | }\n2240 | .entertainment__item:nth-child(1) {\n2241 |   animation: slideInUp 0.8s ease-out 0.1s forwards;\n2242 | }\n2243 | .entertainment__item:nth-child(2) {\n2244 |   animation: slideInUp 0.8s ease-out 0.2s forwards;\n2245 | }\n2246 | .entertainment__item:nth-child(3) {\n2247 |   animation: slideInUp 0.8s ease-out 0.3s forwards;\n2248 | }\n2249 | .entertainment__item:nth-child(4) {\n2250 |   animation: slideInUp 0.8s ease-out 0.4s forwards;\n2251 | }\n2252 | .entertainment__item:nth-child(5) {\n2253 |   animation: slideInUp 0.8s ease-out 0.5s forwards;\n2254 | }\n2255 | .entertainment__item:nth-child(6) {\n2256 |   animation: slideInUp 0.8s ease-out 0.6s forwards;\n2257 | }\n2258 | .entertainment__item--vr:hover {\n2259 |   box-shadow: 0 25px 50px rgba(0, 255, 255, 0.2), 0 15px 30px rgba(0, 200, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2260 | }\n2261 | .entertainment__item--audio:hover {\n2262 |   box-shadow: 0 25px 50px rgba(255, 106, 0, 0.2), 0 15px 30px rgba(255, 140, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2263 | }\n2264 | .entertainment__item--karaoke:hover {\n2265 |   box-shadow: 0 25px 50px rgba(255, 20, 147, 0.2), 0 15px 30px rgba(255, 69, 179, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2266 | }\n2267 | .entertainment__item--games:hover {\n2268 |   box-shadow: 0 25px 50px rgba(50, 205, 50, 0.2), 0 15px 30px rgba(0, 255, 127, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2269 | }\n2270 | .entertainment__item--movies:hover {\n2271 |   box-shadow: 0 25px 50px rgba(255, 215, 0, 0.2), 0 15px 30px rgba(255, 193, 7, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2272 | }\n2273 | .entertainment__item--ps:hover {\n2274 |   box-shadow: 0 25px 50px rgba(0, 123, 255, 0.2), 0 15px 30px rgba(52, 144, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n2275 | }\n2276 | \n2277 | .entertainment__image {\n2278 |   position: absolute;\n2279 |   top: 0;\n2280 |   left: 0;\n2281 |   width: 100%;\n2282 |   height: 100%;\n2283 |   object-fit: cover;\n2284 |   transition: all 0.5s ease;\n2285 |   z-index: 1;\n2286 | }\n2287 | \n2288 | .entertainment__description {\n2289 |   position: absolute;\n2290 |   bottom: 0;\n2291 |   left: 0;\n2292 |   right: 0;\n2293 |   padding: 20px 30px 30px;\n2294 |   white-space: pre-line;\n2295 |   font-weight: 700;\n2296 |   font-size: 20px;\n2297 |   line-height: 28px;\n2298 |   color: var(--main-text-color, #FFFFFF);\n2299 |   margin: 0;\n2300 |   background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%);\n2301 |   transition: all 0.3s ease;\n2302 |   z-index: 2;\n2303 |   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\n2304 | }\n2305 | \n2306 | @keyframes slideInDown {\n2307 |   from {\n2308 |     opacity: 0;\n2309 |     transform: translateY(-30px);\n2310 |   }\n2311 |   to {\n2312 |     opacity: 1;\n2313 |     transform: translateY(0);\n2314 |   }\n2315 | }\n2316 | @keyframes slideInUp {\n2317 |   from {\n2318 |     opacity: 0;\n2319 |     transform: translateY(50px);\n2320 |   }\n2321 |   to {\n2322 |     opacity: 1;\n2323 |     transform: translateY(0);\n2324 |   }\n2325 | }\n2326 | @media screen and (max-width: 1320px) {\n2327 |   .entertainment {\n2328 |     padding: 60px 0;\n2329 |   }\n2330 |   .entertainment__item {\n2331 |     flex-basis: 287px;\n2332 |     width: 287px;\n2333 |     height: 172px;\n2334 |   }\n2335 |   .entertainment__description {\n2336 |     padding: 15px 20px 20px;\n2337 |     font-size: 18px;\n2338 |     line-height: 24px;\n2339 |   }\n2340 |   .entertainment__list {\n2341 |     gap: 30px 20px;\n2342 |   }\n2343 | }\n2344 | @media screen and (max-width: 1023px) {\n2345 |   .entertainment {\n2346 |     padding: 50px 0;\n2347 |   }\n2348 |   .entertainment__item {\n2349 |     flex-basis: 334px;\n2350 |     width: 334px;\n2351 |     height: 200px;\n2352 |   }\n2353 |   .entertainment__item--audio {\n2354 |     margin: unset;\n2355 |   }\n2356 |   .entertainment__item--movies {\n2357 |     margin: unset;\n2358 |   }\n2359 |   .entertainment__item:hover {\n2360 |     transform: translateY(-10px) scale(1.03);\n2361 |   }\n2362 |   .entertainment__list {\n2363 |     gap: 20px;\n2364 |     margin: 0 0 50px 0;\n2365 |   }\n2366 |   .entertainment__description {\n2367 |     font-size: 16px;\n2368 |     line-height: 22px;\n2369 |   }\n2370 | }\n2371 | @media screen and (max-width: 767px) {\n2372 |   .entertainment {\n2373 |     padding: 40px 0;\n2374 |   }\n2375 |   .entertainment__item {\n2376 |     flex-basis: 135px;\n2377 |     width: 135px;\n2378 |     height: 75px;\n2379 |     border-radius: 15px;\n2380 |   }\n2381 |   .entertainment__item--movies {\n2382 |     width: 130px;\n2383 |     white-space: normal;\n2384 |   }\n2385 |   .entertainment__item:hover {\n2386 |     transform: translateY(-5px) scale(1.02);\n2387 |     box-shadow: 0 10px 20px rgba(205, 6, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);\n2388 |   }\n2389 |   .entertainment__description {\n2390 |     padding: 5px 10px 8px;\n2391 |     font-size: 10px;\n2392 |     line-height: 14px;\n2393 |     white-space: normal;\n2394 |   }\n2395 |   .entertainment__title {\n2396 |     margin-bottom: 30px;\n2397 |   }\n2398 | }\n2399 | .faq {\n2400 |   padding: 100px 0;\n2401 |   position: relative;\n2402 |   overflow: hidden;\n2403 | }\n2404 | .faq::before {\n2405 |   content: \"\";\n2406 |   position: absolute;\n2407 |   top: 0;\n2408 |   left: 0;\n2409 |   right: 0;\n2410 |   bottom: 0;\n2411 |   opacity: 0.5;\n2412 |   animation: verticalMove 12s linear infinite;\n2413 | }\n2414 | \n2415 | .faq__list {\n2416 |   max-width: 800px;\n2417 |   margin: 0 auto;\n2418 |   display: flex;\n2419 |   flex-direction: column;\n2420 |   gap: 20px;\n2421 |   position: relative;\n2422 |   z-index: 2;\n2423 | }\n2424 | \n2425 | .faq__item {\n2426 |   background: rgba(255, 255, 255, 0.05);\n2427 |   backdrop-filter: blur(15px);\n2428 |   border: 1px solid rgba(255, 255, 255, 0.1);\n2429 |   border-radius: 20px;\n2430 |   overflow: hidden;\n2431 |   transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n2432 |   opacity: 0;\n2433 |   transform: translateY(30px);\n2434 | }\n2435 | .faq__item:nth-child(1) {\n2436 |   animation: itemAppear 0.6s ease-out 0.1s forwards;\n2437 | }\n2438 | .faq__item:nth-child(2) {\n2439 |   animation: itemAppear 0.6s ease-out 0.2s forwards;\n2440 | }\n2441 | .faq__item:nth-child(3) {\n2442 |   animation: itemAppear 0.6s ease-out 0.3s forwards;\n2443 | }\n2444 | .faq__item:nth-child(4) {\n2445 |   animation: itemAppear 0.6s ease-out 0.4s forwards;\n2446 | }\n2447 | .faq__item:nth-child(5) {\n2448 |   animation: itemAppear 0.6s ease-out 0.5s forwards;\n2449 | }\n2450 | .faq__item:nth-child(6) {\n2451 |   animation: itemAppear 0.6s ease-out 0.6s forwards;\n2452 | }\n2453 | .faq__item:nth-child(7) {\n2454 |   animation: itemAppear 0.6s ease-out 0.7s forwards;\n2455 | }\n2456 | .faq__item:nth-child(8) {\n2457 |   animation: itemAppear 0.6s ease-out 0.8s forwards;\n2458 | }\n2459 | .faq__item:nth-child(9) {\n2460 |   animation: itemAppear 0.6s ease-out 0.9s forwards;\n2461 | }\n2462 | .faq__item:nth-child(10) {\n2463 |   animation: itemAppear 0.6s ease-out 1s forwards;\n2464 | }\n2465 | .faq__item:hover {\n2466 |   transform: translateY(-5px);\n2467 |   box-shadow: 0 15px 35px rgba(205, 6, 255, 0.2);\n2468 |   border-color: rgba(205, 6, 255, 0.3);\n2469 | }\n2470 | .faq__item--active .faq__button {\n2471 |   background: linear-gradient(135deg, rgba(205, 6, 255, 0.2) 0%, rgba(255, 6, 205, 0.2) 100%);\n2472 |   color: #FFFFFF;\n2473 | }\n2474 | .faq__item--active .faq__icon {\n2475 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2476 |   color: #FFFFFF;\n2477 |   transform: rotate(45deg);\n2478 | }\n2479 | .faq__item--active .faq__path--vertical {\n2480 |   opacity: 0;\n2481 | }\n2482 | .faq__item--active .faq__content {\n2483 |   max-height: 200px;\n2484 |   padding: 30px;\n2485 |   opacity: 1;\n2486 | }\n2487 | \n2488 | .faq__button {\n2489 |   width: 100%;\n2490 |   background: transparent;\n2491 |   border: none;\n2492 |   padding: 25px 30px;\n2493 |   display: flex;\n2494 |   align-items: center;\n2495 |   justify-content: space-between;\n2496 |   gap: 20px;\n2497 |   cursor: pointer;\n2498 |   transition: all 0.3s ease;\n2499 |   text-align: left;\n2500 |   position: relative;\n2501 | }\n2502 | .faq__button::before {\n2503 |   content: \"\";\n2504 |   position: absolute;\n2505 |   top: 0;\n2506 |   left: 0;\n2507 |   right: 0;\n2508 |   bottom: 0;\n2509 |   background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\n2510 |   opacity: 0;\n2511 |   transition: opacity 0.3s ease;\n2512 | }\n2513 | .faq__button:hover::before {\n2514 |   opacity: 1;\n2515 | }\n2516 | .faq__button:hover .faq__question {\n2517 |   color: var(--neon-purple, #CD06FF);\n2518 | }\n2519 | .faq__button:hover .faq__icon {\n2520 |   transform: scale(1.1);\n2521 |   background: rgba(205, 6, 255, 0.2);\n2522 | }\n2523 | \n2524 | .faq__question {\n2525 |   font-size: 20px;\n2526 |   font-weight: 600;\n2527 |   color: #FFFFFF;\n2528 |   transition: color 0.3s ease;\n2529 |   position: relative;\n2530 |   z-index: 1;\n2531 | }\n2532 | \n2533 | .faq__icon {\n2534 |   width: 50px;\n2535 |   height: 50px;\n2536 |   border-radius: 50%;\n2537 |   background: rgba(255, 255, 255, 0.1);\n2538 |   display: flex;\n2539 |   align-items: center;\n2540 |   justify-content: center;\n2541 |   transition: all 0.4s ease;\n2542 |   flex-shrink: 0;\n2543 |   position: relative;\n2544 |   z-index: 1;\n2545 | }\n2546 | \n2547 | .faq__svg {\n2548 |   width: 24px;\n2549 |   height: 24px;\n2550 |   color: rgba(255, 255, 255, 0.8);\n2551 |   transition: all 0.4s ease;\n2552 | }\n2553 | \n2554 | .faq__path {\n2555 |   transition: all 0.4s ease;\n2556 |   stroke-width: 2;\n2557 |   stroke: currentColor;\n2558 |   fill: none;\n2559 | }\n2560 | \n2561 | .faq__item--active .faq__icon {\n2562 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2563 |   color: #FFFFFF;\n2564 |   transform: rotate(180deg);\n2565 | }\n2566 | .faq__item--active .faq__svg {\n2567 |   color: #FFFFFF;\n2568 | }\n2569 | \n2570 | .faq__svg {\n2571 |   width: 24px;\n2572 |   height: 24px;\n2573 |   color: rgba(255, 255, 255, 0.8);\n2574 |   transition: color 0.3s ease;\n2575 | }\n2576 | \n2577 | .faq__path {\n2578 |   transition: all 0.3s ease;\n2579 |   stroke-width: 2;\n2580 |   stroke: currentColor;\n2581 |   fill: none;\n2582 | }\n2583 | .faq__path--vertical {\n2584 |   opacity: 1;\n2585 | }\n2586 | .faq__path--horizontal {\n2587 |   opacity: 1;\n2588 | }\n2589 | \n2590 | .faq__content {\n2591 |   max-height: 0;\n2592 |   overflow: hidden;\n2593 |   opacity: 0;\n2594 |   transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n2595 |   background: rgba(0, 0, 0, 0.2);\n2596 | }\n2597 | \n2598 | .faq__answer {\n2599 |   font-size: 16px;\n2600 |   line-height: 24px;\n2601 |   color: rgba(255, 255, 255, 0.9);\n2602 |   margin: 0;\n2603 |   position: relative;\n2604 |   padding-left: 20px;\n2605 | }\n2606 | .faq__answer::before {\n2607 |   content: \"\";\n2608 |   position: absolute;\n2609 |   left: 0;\n2610 |   top: 0;\n2611 |   width: 4px;\n2612 |   height: 100%;\n2613 |   background: linear-gradient(to bottom, #CD06FF, #FF06CD);\n2614 |   border-radius: 2px;\n2615 |   margin-right: 15px;\n2616 | }\n2617 | \n2618 | @keyframes verticalMove {\n2619 |   0% {\n2620 |     transform: translateY(0);\n2621 |   }\n2622 |   100% {\n2623 |     transform: translateY(52px);\n2624 |   }\n2625 | }\n2626 | @keyframes titleSlideIn {\n2627 |   from {\n2628 |     opacity: 0;\n2629 |     transform: translateY(-30px);\n2630 |   }\n2631 |   to {\n2632 |     opacity: 1;\n2633 |     transform: translateY(0);\n2634 |   }\n2635 | }\n2636 | @keyframes lineExpand {\n2637 |   from {\n2638 |     scale: 0 1;\n2639 |   }\n2640 |   to {\n2641 |     scale: 1 1;\n2642 |   }\n2643 | }\n2644 | @keyframes itemAppear {\n2645 |   from {\n2646 |     opacity: 0;\n2647 |     transform: translateY(30px);\n2648 |   }\n2649 |   to {\n2650 |     opacity: 1;\n2651 |     transform: translateY(0);\n2652 |   }\n2653 | }\n2654 | @media screen and (max-width: 1023px) {\n2655 |   .faq {\n2656 |     padding: 70px 0;\n2657 |   }\n2658 |   .faq__title {\n2659 |     margin-bottom: 60px;\n2660 |   }\n2661 |   .faq__button {\n2662 |     padding: 20px 25px;\n2663 |   }\n2664 |   .faq__question {\n2665 |     font-size: 18px;\n2666 |   }\n2667 |   .faq__icon {\n2668 |     width: 45px;\n2669 |     height: 45px;\n2670 |   }\n2671 |   .faq__svg {\n2672 |     width: 20px;\n2673 |     height: 20px;\n2674 |   }\n2675 |   .faq__answer {\n2676 |     font-size: 15px;\n2677 |     line-height: 22px;\n2678 |   }\n2679 |   .faq__item--active .faq__content {\n2680 |     padding: 25px;\n2681 |   }\n2682 | }\n2683 | @media screen and (max-width: 767px) {\n2684 |   .faq {\n2685 |     padding: 50px 0;\n2686 |   }\n2687 |   .faq__title {\n2688 |     margin-bottom: 40px;\n2689 |   }\n2690 |   .faq__list {\n2691 |     gap: 15px;\n2692 |   }\n2693 |   .faq__button {\n2694 |     padding: 18px 20px;\n2695 |     gap: 15px;\n2696 |   }\n2697 |   .faq__question {\n2698 |     font-size: 16px;\n2699 |   }\n2700 |   .faq__icon {\n2701 |     width: 40px;\n2702 |     height: 40px;\n2703 |   }\n2704 |   .faq__svg {\n2705 |     width: 18px;\n2706 |     height: 18px;\n2707 |   }\n2708 |   .faq__answer {\n2709 |     font-size: 14px;\n2710 |     line-height: 20px;\n2711 |     padding-left: 15px;\n2712 |   }\n2713 |   .faq__answer::before {\n2714 |     width: 3px;\n2715 |   }\n2716 |   .faq__item--active .faq__content {\n2717 |     padding: 0 20px 20px;\n2718 |   }\n2719 | }\n2720 | .feedbacks {\n2721 |   padding: 100px 0;\n2722 |   position: relative;\n2723 |   overflow: hidden;\n2724 | }\n2725 | .feedbacks::before {\n2726 |   content: \"\";\n2727 |   position: absolute;\n2728 |   top: 0;\n2729 |   left: 0;\n2730 |   right: 0;\n2731 |   bottom: 0;\n2732 |   opacity: 0.5;\n2733 |   animation: linesMove 15s linear infinite;\n2734 | }\n2735 | \n2736 | .feedbacks__slider {\n2737 |   position: relative;\n2738 |   max-width: 800px;\n2739 |   margin: 0 auto;\n2740 |   z-index: 2;\n2741 | }\n2742 | \n2743 | .feedbacks__wrapper {\n2744 |   overflow: hidden;\n2745 |   border-radius: 25px;\n2746 |   box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);\n2747 |   position: relative;\n2748 | }\n2749 | .feedbacks__wrapper::before {\n2750 |   content: \"\";\n2751 |   position: absolute;\n2752 |   top: 0;\n2753 |   left: 0;\n2754 |   right: 0;\n2755 |   bottom: 0;\n2756 |   background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);\n2757 |   border-radius: 25px;\n2758 |   z-index: 1;\n2759 |   pointer-events: none;\n2760 | }\n2761 | \n2762 | .feedbacks__track {\n2763 |   display: flex;\n2764 |   transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n2765 | }\n2766 | \n2767 | .feedbacks__slide {\n2768 |   min-width: 100%;\n2769 |   opacity: 0;\n2770 |   animation: slideAppear 1s ease-out 0.8s forwards;\n2771 | }\n2772 | \n2773 | .feedbacks__item {\n2774 |   height: 100%;\n2775 |   background: rgba(255, 255, 255, 0.05);\n2776 |   backdrop-filter: blur(20px);\n2777 |   border: 1px solid rgba(255, 255, 255, 0.1);\n2778 |   border-radius: 25px;\n2779 |   padding: 50px;\n2780 |   text-align: center;\n2781 |   position: relative;\n2782 |   z-index: 2;\n2783 | }\n2784 | .feedbacks__item::before {\n2785 |   content: '\"';\n2786 |   position: absolute;\n2787 |   top: -20px;\n2788 |   left: 50%;\n2789 |   transform: translateX(-50%);\n2790 |   font-size: 120px;\n2791 |   color: rgba(205, 6, 255, 0.2);\n2792 |   font-family: serif;\n2793 |   line-height: 1;\n2794 |   z-index: -1;\n2795 | }\n2796 | \n2797 | .feedbacks__photo {\n2798 |   margin: 0 0 30px 0;\n2799 |   display: flex;\n2800 |   flex-direction: column;\n2801 |   align-items: center;\n2802 |   gap: 20px;\n2803 | }\n2804 | \n2805 | .feedbacks__image {\n2806 |   width: 100px;\n2807 |   height: 100px;\n2808 |   border-radius: 50%;\n2809 |   object-fit: cover;\n2810 |   border: 4px solid transparent;\n2811 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2812 |   background-clip: padding-box;\n2813 |   box-shadow: 0 0 30px rgba(205, 6, 255, 0.4), inset 0 0 0 4px rgba(255, 255, 255, 0.1);\n2814 |   transition: all 0.3s ease;\n2815 |   position: relative;\n2816 | }\n2817 | .feedbacks__image::before {\n2818 |   content: \"\";\n2819 |   position: absolute;\n2820 |   top: -8px;\n2821 |   left: -8px;\n2822 |   right: -8px;\n2823 |   bottom: -8px;\n2824 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2825 |   border-radius: 50%;\n2826 |   z-index: -1;\n2827 |   opacity: 0;\n2828 |   transition: opacity 0.3s ease;\n2829 | }\n2830 | .feedbacks__image:hover {\n2831 |   transform: scale(1.1);\n2832 | }\n2833 | .feedbacks__image:hover::before {\n2834 |   opacity: 1;\n2835 | }\n2836 | \n2837 | .feedbacks__name {\n2838 |   font-size: 24px;\n2839 |   font-weight: 700;\n2840 |   color: #FFFFFF;\n2841 |   margin: 0;\n2842 |   text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\n2843 |   position: relative;\n2844 | }\n2845 | .feedbacks__name::after {\n2846 |   content: \"\";\n2847 |   position: absolute;\n2848 |   bottom: -8px;\n2849 |   left: 50%;\n2850 |   transform: translateX(-50%);\n2851 |   width: 0;\n2852 |   height: 2px;\n2853 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2854 |   transition: width 0.3s ease;\n2855 | }\n2856 | .feedbacks__name:hover::after {\n2857 |   width: 100%;\n2858 | }\n2859 | \n2860 | .feedbacks__text {\n2861 |   font-size: 18px;\n2862 |   line-height: 28px;\n2863 |   color: rgba(255, 255, 255, 0.9);\n2864 |   margin: 0;\n2865 |   font-style: italic;\n2866 |   position: relative;\n2867 |   z-index: 1;\n2868 | }\n2869 | \n2870 | .feedbacks__controls {\n2871 |   display: flex;\n2872 |   align-items: center;\n2873 |   justify-content: center;\n2874 |   gap: 30px;\n2875 |   margin-top: 40px;\n2876 | }\n2877 | \n2878 | .feedbacks__btn {\n2879 |   width: 60px;\n2880 |   height: 60px;\n2881 |   border: 2px solid rgba(205, 6, 255, 0.3);\n2882 |   border-radius: 50%;\n2883 |   background: rgba(255, 255, 255, 0.05);\n2884 |   backdrop-filter: blur(10px);\n2885 |   color: rgba(255, 255, 255, 0.7);\n2886 |   cursor: pointer;\n2887 |   transition: all 0.3s ease;\n2888 |   display: flex;\n2889 |   align-items: center;\n2890 |   justify-content: center;\n2891 |   position: relative;\n2892 |   overflow: hidden;\n2893 | }\n2894 | .feedbacks__btn::before {\n2895 |   content: \"\";\n2896 |   position: absolute;\n2897 |   top: 0;\n2898 |   left: 0;\n2899 |   right: 0;\n2900 |   bottom: 0;\n2901 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2902 |   opacity: 0;\n2903 |   transition: opacity 0.3s ease;\n2904 |   border-radius: 50%;\n2905 | }\n2906 | .feedbacks__btn:hover {\n2907 |   border-color: #CD06FF;\n2908 |   color: #FFFFFF;\n2909 |   transform: scale(1.1);\n2910 | }\n2911 | .feedbacks__btn:hover::before {\n2912 |   opacity: 0.2;\n2913 | }\n2914 | .feedbacks__btn:active {\n2915 |   transform: scale(0.95);\n2916 | }\n2917 | .feedbacks__btn:disabled {\n2918 |   opacity: 0.3;\n2919 |   cursor: not-allowed;\n2920 |   transform: scale(1);\n2921 | }\n2922 | .feedbacks__btn:disabled:hover::before {\n2923 |   opacity: 0;\n2924 | }\n2925 | \n2926 | .feedbacks__icon {\n2927 |   width: 24px;\n2928 |   height: 24px;\n2929 |   position: relative;\n2930 |   z-index: 1;\n2931 | }\n2932 | \n2933 | .feedbacks__dots {\n2934 |   display: flex;\n2935 |   gap: 15px;\n2936 |   align-items: center;\n2937 | }\n2938 | \n2939 | .feedbacks__dot {\n2940 |   width: 12px;\n2941 |   height: 12px;\n2942 |   border-radius: 50%;\n2943 |   background: rgba(255, 255, 255, 0.3);\n2944 |   cursor: pointer;\n2945 |   transition: all 0.3s ease;\n2946 |   position: relative;\n2947 | }\n2948 | .feedbacks__dot::before {\n2949 |   content: \"\";\n2950 |   position: absolute;\n2951 |   top: -4px;\n2952 |   left: -4px;\n2953 |   right: -4px;\n2954 |   bottom: -4px;\n2955 |   border: 2px solid transparent;\n2956 |   border-radius: 50%;\n2957 |   transition: border-color 0.3s ease;\n2958 | }\n2959 | .feedbacks__dot:hover {\n2960 |   background: rgba(255, 255, 255, 0.6);\n2961 |   transform: scale(1.2);\n2962 | }\n2963 | .feedbacks__dot--active {\n2964 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n2965 |   transform: scale(1.3);\n2966 |   box-shadow: 0 0 15px rgba(205, 6, 255, 0.6);\n2967 | }\n2968 | .feedbacks__dot--active::before {\n2969 |   border-color: rgba(205, 6, 255, 0.3);\n2970 | }\n2971 | \n2972 | @keyframes linesMove {\n2973 |   0% {\n2974 |     transform: translateX(0);\n2975 |   }\n2976 |   100% {\n2977 |     transform: translateX(102px);\n2978 |   }\n2979 | }\n2980 | @keyframes titleFadeIn {\n2981 |   from {\n2982 |     opacity: 0;\n2983 |     transform: translateY(-30px);\n2984 |   }\n2985 |   to {\n2986 |     opacity: 1;\n2987 |     transform: translateY(0);\n2988 |   }\n2989 | }\n2990 | @keyframes lineGrow {\n2991 |   from {\n2992 |     scale: 0 1;\n2993 |   }\n2994 |   to {\n2995 |     scale: 1 1;\n2996 |   }\n2997 | }\n2998 | @keyframes slideAppear {\n2999 |   from {\n3000 |     opacity: 0;\n3001 |     transform: translateY(30px);\n3002 |   }\n3003 |   to {\n3004 |     opacity: 1;\n3005 |     transform: translateY(0);\n3006 |   }\n3007 | }\n3008 | @media screen and (max-width: 1023px) {\n3009 |   .feedbacks {\n3010 |     padding: 70px 0;\n3011 |   }\n3012 |   .feedbacks__title {\n3013 |     margin-bottom: 60px;\n3014 |   }\n3015 |   .feedbacks__item {\n3016 |     padding: 40px;\n3017 |   }\n3018 |   .feedbacks__image {\n3019 |     width: 80px;\n3020 |     height: 80px;\n3021 |   }\n3022 |   .feedbacks__name {\n3023 |     font-size: 20px;\n3024 |   }\n3025 |   .feedbacks__text {\n3026 |     font-size: 16px;\n3027 |     line-height: 24px;\n3028 |   }\n3029 |   .feedbacks__btn {\n3030 |     width: 50px;\n3031 |     height: 50px;\n3032 |   }\n3033 |   .feedbacks__icon {\n3034 |     width: 20px;\n3035 |     height: 20px;\n3036 |   }\n3037 | }\n3038 | @media screen and (max-width: 767px) {\n3039 |   .feedbacks {\n3040 |     padding: 50px 0;\n3041 |   }\n3042 |   .feedbacks__title {\n3043 |     margin-bottom: 40px;\n3044 |   }\n3045 |   .feedbacks__item {\n3046 |     padding: 30px 20px;\n3047 |   }\n3048 |   .feedbacks__item::before {\n3049 |     font-size: 80px;\n3050 |     top: -15px;\n3051 |   }\n3052 |   .feedbacks__image {\n3053 |     width: 70px;\n3054 |     height: 70px;\n3055 |   }\n3056 |   .feedbacks__name {\n3057 |     font-size: 18px;\n3058 |   }\n3059 |   .feedbacks__text {\n3060 |     font-size: 14px;\n3061 |     line-height: 20px;\n3062 |   }\n3063 |   .feedbacks__controls {\n3064 |     gap: 20px;\n3065 |     margin-top: 30px;\n3066 |   }\n3067 |   .feedbacks__btn {\n3068 |     width: 45px;\n3069 |     height: 45px;\n3070 |   }\n3071 |   .feedbacks__icon {\n3072 |     width: 18px;\n3073 |     height: 18px;\n3074 |   }\n3075 |   .feedbacks__dots {\n3076 |     gap: 10px;\n3077 |   }\n3078 |   .feedbacks__dot {\n3079 |     width: 10px;\n3080 |     height: 10px;\n3081 |   }\n3082 | }\n3083 | .main-banner {\n3084 |   position: relative;\n3085 | }\n3086 | .main-banner::before {\n3087 |   content: \"\";\n3088 |   position: absolute;\n3089 |   top: 0;\n3090 |   left: 0;\n3091 |   right: 0;\n3092 |   bottom: 0;\n3093 |   animation: backgroundPulse 8s ease-in-out infinite;\n3094 | }\n3095 | .main-banner__container {\n3096 |   display: flex;\n3097 |   justify-content: center;\n3098 |   position: relative;\n3099 |   z-index: 2;\n3100 | }\n3101 | .main-banner__text-wrap {\n3102 |   position: relative;\n3103 |   height: 823px;\n3104 |   max-width: 1180px;\n3105 |   margin: 0 auto;\n3106 |   flex-basis: 1174px;\n3107 |   padding-top: 100px;\n3108 | }\n3109 | .main-banner__text-wrap:after {\n3110 |   content: \"\";\n3111 |   background-image: url(${___CSS_LOADER_URL_REPLACEMENT_8___});\n3112 |   background-size: 675px 762px;\n3113 |   width: 675px;\n3114 |   height: 762px;\n3115 |   display: inline-block;\n3116 |   position: absolute;\n3117 |   bottom: -62px;\n3118 |   left: 500px;\n3119 |   opacity: 0.9;\n3120 |   animation: floatImage 6s ease-in-out infinite;\n3121 |   mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 70%, transparent 100%);\n3122 | }\n3123 | .main-banner__subtitle {\n3124 |   text-transform: uppercase;\n3125 |   font-weight: 900;\n3126 |   font-size: 150px;\n3127 |   letter-spacing: -15px;\n3128 |   line-height: 100%;\n3129 |   margin: 0;\n3130 |   padding: 0;\n3131 |   background: linear-gradient(45deg, #CD06FF, #FF06CD, #CD06FF);\n3132 |   background-size: 200% 200%;\n3133 |   -webkit-background-clip: text;\n3134 |   background-clip: text;\n3135 |   -webkit-text-fill-color: transparent;\n3136 |   animation: gradientShift 3s ease-in-out infinite;\n3137 |   text-shadow: 0 0 50px rgba(205, 6, 255, 0.5);\n3138 | }\n3139 | .main-banner__title {\n3140 |   font-size: 28px;\n3141 |   padding: 0 0 0 100px;\n3142 |   line-height: 50px;\n3143 |   font-weight: 400;\n3144 |   margin: 0 0 30px 0;\n3145 |   text-align: left;\n3146 |   text-transform: unset;\n3147 |   opacity: 0;\n3148 |   animation: slideInLeft 1s ease-out 0.5s forwards;\n3149 | }\n3150 | .main-banner__advantages {\n3151 |   display: flex;\n3152 |   flex-direction: row;\n3153 |   gap: 40px;\n3154 |   margin: 0 0 150px 0;\n3155 |   opacity: 0;\n3156 |   animation: slideInUp 1s ease-out 1s forwards;\n3157 | }\n3158 | .main-banner__advantage {\n3159 |   display: flex;\n3160 |   flex-direction: column;\n3161 |   align-items: center;\n3162 |   justify-content: flex-end;\n3163 |   flex-basis: 210px;\n3164 |   transition: transform 0.3s ease;\n3165 | }\n3166 | .main-banner__advantage:hover {\n3167 |   transform: translateY(-10px);\n3168 | }\n3169 | .main-banner__advantage-number {\n3170 |   margin: 0;\n3171 |   padding: 0;\n3172 |   position: relative;\n3173 |   font-weight: 900;\n3174 |   font-size: 100px;\n3175 |   line-height: 141px;\n3176 |   color: var(--neon-purple, #CD06FF);\n3177 |   font-variant: small-caps;\n3178 |   margin: 0;\n3179 |   text-shadow: 0 0 30px rgba(205, 6, 255, 0.8);\n3180 |   animation: numberPulse 2s ease-in-out infinite;\n3181 | }\n3182 | .main-banner__advantage-number::after {\n3183 |   content: \"\";\n3184 |   position: absolute;\n3185 |   bottom: 15px;\n3186 |   left: 50%;\n3187 |   transform: translateX(-50%);\n3188 |   width: 0;\n3189 |   height: 3px;\n3190 |   background: linear-gradient(45deg, #CD06FF, #FF06CD);\n3191 |   transition: width 0.3s ease;\n3192 | }\n3193 | .main-banner__advantage-number:hover::after {\n3194 |   width: 100%;\n3195 | }\n3196 | .main-banner__advantage-text {\n3197 |   margin: 0;\n3198 |   padding: 0;\n3199 |   transition: color 0.3s ease;\n3200 | }\n3201 | .main-banner__advantage:hover .main-banner__advantage-text {\n3202 |   color: var(--neon-purple, #CD06FF);\n3203 | }\n3204 | .main-banner__link {\n3205 |   display: inline-block;\n3206 |   opacity: 0;\n3207 |   animation: slideInUp 1s ease-out 1.5s forwards;\n3208 | }\n3209 | .main-banner__button {\n3210 |   background: linear-gradient(45deg, var(--dark-purple, #6C0287), var(--cold-purple, #640AA3));\n3211 |   border: none;\n3212 |   border-radius: 50px;\n3213 |   width: 374px;\n3214 |   height: 80px;\n3215 |   box-shadow: 0 0 30px rgba(205, 6, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);\n3216 |   font-weight: 700;\n3217 |   font-size: 26px;\n3218 |   line-height: 30px;\n3219 |   text-transform: uppercase;\n3220 |   color: var(--main-text-color, #FFFFFF);\n3221 |   cursor: pointer;\n3222 |   transition: all 0.3s ease;\n3223 |   position: relative;\n3224 |   overflow: hidden;\n3225 | }\n3226 | .main-banner__button::before {\n3227 |   content: \"\";\n3228 |   position: absolute;\n3229 |   top: 0;\n3230 |   left: -100%;\n3231 |   width: 100%;\n3232 |   height: 100%;\n3233 |   background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);\n3234 |   transition: left 0.6s ease;\n3235 | }\n3236 | .main-banner__button:hover {\n3237 |   transform: translateY(-5px);\n3238 |   box-shadow: 0 15px 40px rgba(205, 6, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);\n3239 | }\n3240 | .main-banner__button:hover::before {\n3241 |   left: 100%;\n3242 | }\n3243 | .main-banner__button:focus {\n3244 |   outline: 2px solid var(--neon-purple, #CD06FF);\n3245 | }\n3246 | .main-banner__button:active {\n3247 |   transform: translateY(-2px);\n3248 |   box-shadow: 0 8px 20px rgba(205, 6, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);\n3249 | }\n3250 | .main-banner__scroll {\n3251 |   width: 97px;\n3252 |   height: 97px;\n3253 |   display: inline-block;\n3254 |   position: absolute;\n3255 |   top: 646px;\n3256 |   left: 536px;\n3257 |   z-index: 99;\n3258 |   opacity: 0;\n3259 |   animation: fadeInBounce 1s ease-out 2s forwards;\n3260 | }\n3261 | .main-banner__scroll-icon {\n3262 |   border: 2px solid rgba(255, 255, 255, 0.6);\n3263 |   border-radius: 50%;\n3264 |   transition: all 0.4s ease;\n3265 |   animation: scrollPulse 2s ease-in-out infinite;\n3266 | }\n3267 | .main-banner__scroll-icon:hover {\n3268 |   border-color: var(--neon-purple, #CD06FF);\n3269 |   background: rgba(205, 6, 255, 0.1);\n3270 |   transform: scale(1.1);\n3271 | }\n3272 | .main-banner__scroll-icon:hover .main-banner__scroll-rect {\n3273 |   fill: var(--neon-purple, #CD06FF);\n3274 | }\n3275 | .main-banner__scroll-icon:active {\n3276 |   background: var(--neon-purple, #CD06FF);\n3277 |   border-color: var(--neon-purple, #CD06FF);\n3278 |   transform: scale(0.95);\n3279 | }\n3280 | .main-banner__scroll-icon:active .main-banner__scroll-rect {\n3281 |   fill: var(--main-text-color, #FFFFFF);\n3282 | }\n3283 | .main-banner__scroll-circle {\n3284 |   fill: transparent;\n3285 | }\n3286 | .main-banner__scroll-rect {\n3287 |   fill: rgba(255, 255, 255, 0.8);\n3288 |   transition: fill 0.3s ease;\n3289 | }\n3290 | \n3291 | @keyframes backgroundPulse {\n3292 |   0%, 100% {\n3293 |     opacity: 1;\n3294 |   }\n3295 |   50% {\n3296 |     opacity: 0.7;\n3297 |   }\n3298 | }\n3299 | @keyframes gradientShift {\n3300 |   0%, 100% {\n3301 |     background-position: 0% 50%;\n3302 |   }\n3303 |   50% {\n3304 |     background-position: 100% 50%;\n3305 |   }\n3306 | }\n3307 | @keyframes slideInLeft {\n3308 |   from {\n3309 |     opacity: 0;\n3310 |     transform: translateX(-50px);\n3311 |   }\n3312 |   to {\n3313 |     opacity: 1;\n3314 |     transform: translateX(0);\n3315 |   }\n3316 | }\n3317 | @keyframes slideInUp {\n3318 |   from {\n3319 |     opacity: 0;\n3320 |     transform: translateY(30px);\n3321 |   }\n3322 |   to {\n3323 |     opacity: 1;\n3324 |     transform: translateY(0);\n3325 |   }\n3326 | }\n3327 | @keyframes fadeInBounce {\n3328 |   0% {\n3329 |     opacity: 0;\n3330 |     transform: translateY(20px);\n3331 |   }\n3332 |   60% {\n3333 |     opacity: 1;\n3334 |     transform: translateY(-5px);\n3335 |   }\n3336 |   100% {\n3337 |     opacity: 1;\n3338 |     transform: translateY(0);\n3339 |   }\n3340 | }\n3341 | @keyframes floatImage {\n3342 |   0%, 100% {\n3343 |     transform: translateY(0px) rotate(0deg);\n3344 |   }\n3345 |   50% {\n3346 |     transform: translateY(-20px) rotate(1deg);\n3347 |   }\n3348 | }\n3349 | @keyframes numberPulse {\n3350 |   0%, 100% {\n3351 |     text-shadow: 0 0 30px rgba(205, 6, 255, 0.8);\n3352 |     transform: scale(1);\n3353 |   }\n3354 |   50% {\n3355 |     text-shadow: 0 0 40px rgb(205, 6, 255);\n3356 |     transform: scale(1.02);\n3357 |   }\n3358 | }\n3359 | @keyframes scrollPulse {\n3360 |   0%, 100% {\n3361 |     opacity: 0.8;\n3362 |     transform: translateY(0);\n3363 |   }\n3364 |   50% {\n3365 |     opacity: 1;\n3366 |     transform: translateY(-5px);\n3367 |   }\n3368 | }\n3369 | @media screen and (max-width: 1320px) {\n3370 |   .main-banner {\n3371 |     padding: 30px 60px 40px 60px;\n3372 |   }\n3373 |   .main-banner__text-wrap {\n3374 |     flex-basis: 904px;\n3375 |     height: 583px;\n3376 |   }\n3377 |   .main-banner__text-wrap:after {\n3378 |     background-size: 453px 520px;\n3379 |     width: 453px;\n3380 |     height: 520px;\n3381 |     top: 63px;\n3382 |     left: 459px;\n3383 |   }\n3384 |   .main-banner__subtitle {\n3385 |     font-size: 120px;\n3386 |     letter-spacing: -11px;\n3387 |     margin: 0 0 20px 0;\n3388 |   }\n3389 |   .main-banner__title {\n3390 |     padding: 0 0 0 100px;\n3391 |     font-size: 22px;\n3392 |     line-height: 30px;\n3393 |     margin: 0 0 30px 0;\n3394 |   }\n3395 |   .main-banner__advantages {\n3396 |     margin: 0 0 80px 0;\n3397 |   }\n3398 |   .main-banner__button {\n3399 |     border-radius: 10px;\n3400 |     margin: 0 0 0 40px;\n3401 |     width: 296px;\n3402 |     height: 64px;\n3403 |     font-size: 22px;\n3404 |     line-height: 30px;\n3405 |   }\n3406 |   .main-banner__scroll {\n3407 |     width: 67px;\n3408 |     height: 67px;\n3409 |     top: 471px;\n3410 |     left: 432px;\n3411 |   }\n3412 | }\n3413 | @media screen and (max-width: 1023px) {\n3414 |   .main-banner {\n3415 |     padding: 30px 40px 40px 40px;\n3416 |   }\n3417 |   .main-banner__text-wrap {\n3418 |     flex-basis: 688px;\n3419 |     height: 537px;\n3420 |   }\n3421 |   .main-banner__text-wrap:after {\n3422 |     background-size: 409px 479px;\n3423 |     width: 409px;\n3424 |     height: 479px;\n3425 |     top: 57px;\n3426 |     left: 283px;\n3427 |   }\n3428 |   .main-banner__subtitle {\n3429 |     font-size: 86px;\n3430 |     line-height: 86px;\n3431 |     letter-spacing: -8px;\n3432 |   }\n3433 |   .main-banner__title {\n3434 |     padding: 0 0 0 60px;\n3435 |     font-size: 18px;\n3436 |     line-height: 24px;\n3437 |     margin: 0 0 50px 0;\n3438 |   }\n3439 |   .main-banner__advantages {\n3440 |     gap: 32px;\n3441 |   }\n3442 |   .main-banner__button {\n3443 |     margin: unset;\n3444 |     border-radius: 4px;\n3445 |     width: 214px;\n3446 |     height: 46px;\n3447 |     font-size: 16px;\n3448 |     line-height: 24px;\n3449 |   }\n3450 |   .main-banner__button:hover, .main-banner__button:focus, .main-banner__button:active {\n3451 |     border-radius: 4px;\n3452 |   }\n3453 |   .main-banner__scroll {\n3454 |     display: none;\n3455 |   }\n3456 | }\n3457 | @media screen and (max-width: 767px) {\n3458 |   .main-banner {\n3459 |     padding: 20px 20px 30px 20px;\n3460 |   }\n3461 |   .main-banner__text-wrap {\n3462 |     flex-basis: 280px;\n3463 |     height: 204px;\n3464 |   }\n3465 |   .main-banner__text-wrap:after {\n3466 |     background-size: cover;\n3467 |     width: 161px;\n3468 |     height: 179px;\n3469 |     top: 23px;\n3470 |     left: 119px;\n3471 |   }\n3472 |   .main-banner__subtitle {\n3473 |     font-size: 35px;\n3474 |     line-height: 35px;\n3475 |     letter-spacing: -3px;\n3476 |     margin: 0 0 6px 0;\n3477 |   }\n3478 |   .main-banner__title {\n3479 |     font-size: 10px;\n3480 |     line-height: 14px;\n3481 |     padding: 0 0 0 15px;\n3482 |     margin: 0 0 10px 0;\n3483 |   }\n3484 |   .main-banner__advantages {\n3485 |     margin: 0 0 30px 0;\n3486 |     gap: 20px;\n3487 |   }\n3488 |   .main-banner__button {\n3489 |     margin: unset;\n3490 |     border-radius: 4px;\n3491 |     width: 117px;\n3492 |     height: 27px;\n3493 |     font-size: 10px;\n3494 |     line-height: 12px;\n3495 |   }\n3496 | }\n3497 | .room {\n3498 |   padding: 50px 0 100px 0;\n3499 | }\n3500 | \n3501 | .room__list {\n3502 |   display: flex;\n3503 |   flex-wrap: wrap;\n3504 |   justify-content: center;\n3505 |   gap: 20px;\n3506 |   flex-direction: row;\n3507 |   align-items: center;\n3508 |   list-style-type: none;\n3509 | }\n3510 | \n3511 | .room__item {\n3512 |   background-size: cover;\n3513 |   background-repeat: no-repeat;\n3514 |   width: 580px;\n3515 |   height: 349px;\n3516 |   flex-basis: 580px;\n3517 |   display: flex;\n3518 |   align-items: center;\n3519 |   justify-content: center;\n3520 |   position: relative;\n3521 |   transition: 0.4s;\n3522 | }\n3523 | .room__item:hover {\n3524 |   transform: scale(1.1);\n3525 |   box-shadow: 0 0 20px 1px var(--dark-purple, #6C0287);\n3526 | }\n3527 | \n3528 | .room__image {\n3529 |   position: absolute;\n3530 |   top: 0;\n3531 |   left: 0;\n3532 |   width: 100%;\n3533 |   height: 100%;\n3534 |   object-fit: cover;\n3535 |   z-index: -1;\n3536 | }\n3537 | \n3538 | .room__description {\n3539 |   position: absolute;\n3540 |   text-transform: uppercase;\n3541 |   font-weight: 700;\n3542 |   font-size: 70px;\n3543 |   white-space: pre-line;\n3544 |   text-align: center;\n3545 |   line-height: 80px;\n3546 |   margin: 0;\n3547 |   z-index: 1;\n3548 | }\n3549 | \n3550 | @media screen and (max-width: 1320px) {\n3551 |   .room {\n3552 |     padding: 35px 0 70px 0;\n3553 |   }\n3554 |   .room__list {\n3555 |     gap: 18px;\n3556 |   }\n3557 |   .room__item {\n3558 |     width: 443px;\n3559 |     height: 267px;\n3560 |     flex-basis: 443px;\n3561 |   }\n3562 |   .room__description {\n3563 |     font-size: 50px;\n3564 |     line-height: 60px;\n3565 |   }\n3566 | }\n3567 | @media screen and (max-width: 1023px) {\n3568 |   .room__item {\n3569 |     width: 335px;\n3570 |     height: 200px;\n3571 |     flex-basis: 335px;\n3572 |   }\n3573 |   .room__description {\n3574 |     font-size: 40px;\n3575 |     line-height: 50px;\n3576 |   }\n3577 | }\n3578 | @media screen and (max-width: 767px) {\n3579 |   .room__item {\n3580 |     width: 280px;\n3581 |     height: 168px;\n3582 |   }\n3583 | }\n3584 | @media screen and (max-width: 630px) {\n3585 |   .room {\n3586 |     padding: 15px 20px 30px 20px;\n3587 |   }\n3588 |   .room__item {\n3589 |     flex-basis: 280px;\n3590 |   }\n3591 |   .room__description {\n3592 |     font-size: 26px;\n3593 |     line-height: 34px;\n3594 |   }\n3595 | }\n3596 | .modal {\n3597 |   position: fixed;\n3598 |   top: 0;\n3599 |   left: 0;\n3600 |   width: 100%;\n3601 |   height: 100%;\n3602 |   z-index: 1000;\n3603 |   opacity: 0;\n3604 |   visibility: hidden;\n3605 |   transition: opacity 0.3s ease, visibility 0.3s ease;\n3606 | }\n3607 | .modal--active {\n3608 |   opacity: 1;\n3609 |   visibility: visible;\n3610 | }\n3611 | \n3612 | .modal__overlay {\n3613 |   position: absolute;\n3614 |   top: 0;\n3615 |   left: 0;\n3616 |   width: 100%;\n3617 |   height: 100%;\n3618 |   background-color: rgba(0, 0, 0, 0.8);\n3619 |   cursor: pointer;\n3620 | }\n3621 | \n3622 | .modal__content {\n3623 |   position: absolute;\n3624 |   top: 50%;\n3625 |   left: 50%;\n3626 |   transform: translate(-50%, -50%);\n3627 |   background-color: var(--main-background-color, #1B1A1B);\n3628 |   border: 2px solid var(--neon-purple, #CD06FF);\n3629 |   border-radius: 15px;\n3630 |   width: 90%;\n3631 |   max-width: 500px;\n3632 |   max-height: 90vh;\n3633 |   overflow-y: auto;\n3634 |   padding: 40px;\n3635 | }\n3636 | \n3637 | .modal__close {\n3638 |   position: absolute;\n3639 |   top: 20px;\n3640 |   right: 20px;\n3641 |   background: transparent;\n3642 |   border: none;\n3643 |   color: var(--main-text-color, #FFFFFF);\n3644 |   cursor: pointer;\n3645 |   padding: 5px;\n3646 |   transition: color 0.3s ease;\n3647 | }\n3648 | .modal__close:hover {\n3649 |   color: var(--neon-purple, #CD06FF);\n3650 | }\n3651 | \n3652 | .modal__header {\n3653 |   margin-bottom: 30px;\n3654 |   text-align: center;\n3655 | }\n3656 | \n3657 | .modal__title {\n3658 |   font-size: 28px;\n3659 |   font-weight: 700;\n3660 |   color: var(--main-text-color, #FFFFFF);\n3661 |   text-transform: uppercase;\n3662 | }\n3663 | \n3664 | .modal__form-group {\n3665 |   margin-bottom: 20px;\n3666 | }\n3667 | \n3668 | .modal__input {\n3669 |   width: 100%;\n3670 |   height: 50px;\n3671 |   background-color: transparent;\n3672 |   border: 2px solid var(--neon-purple, #CD06FF);\n3673 |   border-radius: 8px;\n3674 |   padding: 15px;\n3675 |   color: var(--main-text-color, #FFFFFF);\n3676 |   font-size: 16px;\n3677 |   transition: border-color 0.3s ease;\n3678 | }\n3679 | .modal__input::placeholder {\n3680 |   color: rgba(255, 255, 255, 0.6);\n3681 | }\n3682 | .modal__input:focus {\n3683 |   outline: none;\n3684 |   border-color: var(--dark-purple, #6C0287);\n3685 | }\n3686 | \n3687 | .modal__textarea {\n3688 |   width: 100%;\n3689 |   background-color: transparent;\n3690 |   border: 2px solid var(--neon-purple, #CD06FF);\n3691 |   border-radius: 8px;\n3692 |   padding: 15px;\n3693 |   color: var(--main-text-color, #FFFFFF);\n3694 |   font-size: 16px;\n3695 |   resize: vertical;\n3696 |   font-family: inherit;\n3697 |   transition: border-color 0.3s ease;\n3698 | }\n3699 | .modal__textarea::placeholder {\n3700 |   color: rgba(255, 255, 255, 0.6);\n3701 | }\n3702 | .modal__textarea:focus {\n3703 |   outline: none;\n3704 |   border-color: var(--dark-purple, #6C0287);\n3705 | }\n3706 | \n3707 | .modal__submit {\n3708 |   width: 100%;\n3709 |   height: 55px;\n3710 |   background-color: transparent;\n3711 |   border: 3px solid var(--neon-purple, #CD06FF);\n3712 |   border-radius: 10px;\n3713 |   color: var(--main-text-color, #FFFFFF);\n3714 |   font-size: 18px;\n3715 |   font-weight: 700;\n3716 |   text-transform: uppercase;\n3717 |   cursor: pointer;\n3718 |   transition: background-color 0.4s ease, border-color 0.4s ease;\n3719 | }\n3720 | .modal__submit:hover {\n3721 |   background-color: var(--dark-purple, #6C0287);\n3722 |   border-color: var(--dark-purple, #6C0287);\n3723 | }\n3724 | .modal__submit:focus {\n3725 |   outline: none;\n3726 |   background-color: var(--dark-purple, #6C0287);\n3727 |   border-color: var(--dark-purple, #6C0287);\n3728 | }\n3729 | .modal__submit:active {\n3730 |   background-color: var(--cold-purple, #640AA3);\n3731 |   border-color: var(--cold-purple, #640AA3);\n3732 | }\n3733 | \n3734 | @media screen and (max-width: 767px) {\n3735 |   .modal__content {\n3736 |     padding: 30px 20px;\n3737 |     width: 95%;\n3738 |   }\n3739 |   .modal__title {\n3740 |     font-size: 24px;\n3741 |   }\n3742 |   .modal__input,\n3743 |   .modal__textarea {\n3744 |     font-size: 14px;\n3745 |   }\n3746 |   .modal__submit {\n3747 |     font-size: 16px;\n3748 |     height: 50px;\n3749 |   }\n3750 | }`, \"\",{\"version\":3,\"sources\":[\"webpack://./resources/scss/app.scss\",\"webpack://./resources/scss/fonts/_fonts.scss\",\"webpack://./resources/scss/global/_global.scss\",\"webpack://./resources/scss/normalize.scss\",\"webpack://./resources/scss/admin/_admin.scss\",\"webpack://./resources/scss/components/partials/_header.scss\",\"webpack://./resources/scss/components/partials/_footer.scss\",\"webpack://./resources/scss/blocks/_about-us.scss\",\"webpack://./resources/scss/blocks/_booking.scss\",\"webpack://./resources/scss/blocks/_entertainment.scss\",\"webpack://./resources/scss/blocks/_faq.scss\",\"webpack://./resources/scss/blocks/_feedbacks.scss\",\"webpack://./resources/scss/blocks/_main-banner.scss\",\"webpack://./resources/scss/blocks/_rooms.scss\",\"webpack://./resources/scss/modals/_callback.scss\"],\"names\":[],\"mappings\":\"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\",\"sourcesContent\":[\"@charset \\\"UTF-8\\\";\\n@import url(\\\"https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap\\\");\\n@font-face {\\n  font-family: \\\"Inter\\\";\\n  src: url(\\\"../fonts/inter-semibold.woff2\\\") format(\\\"woff2\\\"), url(\\\"../fonts/inter-semibold.woff\\\") format(\\\"woff\\\");\\n  font-style: normal;\\n  font-weight: 600;\\n}\\n@font-face {\\n  font-family: \\\"Inter\\\";\\n  src: url(\\\"../fonts/inter-bold.woff2\\\") format(\\\"woff2\\\"), url(\\\"../fonts/inter-bold.woff\\\") format(\\\"woff\\\");\\n  font-style: normal;\\n  font-weight: 700;\\n}\\nhtml {\\n  box-sizing: border-box;\\n  position: relative;\\n}\\n\\n*,\\n*::before,\\n*::after {\\n  box-sizing: inherit;\\n}\\n\\nbody {\\n  background: linear-gradient(to bottom, rgba(205, 6, 255, 0.15) 0%, transparent 100%), linear-gradient(135deg, #1b1a1b 0%, #2a1b2a 50%, #1b1a1b 100%);\\n  color: var(--main-text-color, #FFFFFF);\\n  font-family: Arial, sans-serif;\\n  font-size: 20px;\\n  font-weight: 400;\\n  min-height: 100vh;\\n  margin: 0 auto;\\n}\\n\\nimg, svg {\\n  max-width: 100%;\\n  max-height: 100%;\\n  height: auto;\\n}\\n\\nbutton {\\n  cursor: pointer;\\n}\\n\\na {\\n  color: inherit;\\n  text-decoration: none;\\n}\\n\\nul {\\n  padding: 0;\\n  margin: 0;\\n  list-style: none;\\n}\\n\\nfigure, fieldset {\\n  margin: 0;\\n  border: none;\\n  padding: 0;\\n}\\n\\nsection {\\n  padding: 50px 0 50px 0;\\n}\\n\\nh1 {\\n  font-size: 45px;\\n  text-transform: uppercase;\\n  text-align: center;\\n}\\n\\nh2 {\\n  text-align: center;\\n  text-transform: uppercase;\\n  font-weight: 700;\\n  font-size: 40px;\\n  line-height: 50px;\\n  position: relative;\\n  z-index: 2;\\n  margin-bottom: 80px;\\n  opacity: 0;\\n  animation: titleAppear 1s ease-out forwards;\\n}\\nh2::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  bottom: -15px;\\n  left: 50%;\\n  transform: translateX(-50%);\\n  width: 80px;\\n  height: 3px;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  border-radius: 2px;\\n  animation: lineExpand 1s ease-out 0.5s forwards;\\n  scale: 0 1;\\n}\\n\\np {\\n  font-size: 20px;\\n}\\n\\n.container {\\n  max-width: 1180px;\\n  margin: 0 auto;\\n}\\n\\n@media screen and (max-width: 1320px) {\\n  section {\\n    padding: 35px 60px 35px 60px;\\n  }\\n  h1 {\\n    font-size: 35px;\\n  }\\n  h2 {\\n    font-size: 30px;\\n    line-height: 40px;\\n    margin: 0 0 36px 0;\\n  }\\n  p {\\n    font-size: 18px;\\n  }\\n  circle {\\n    stroke: var(--dark-purple, #6C0287);\\n    stroke-width: 1;\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  section {\\n    padding: 35px 40px 35px 40px;\\n  }\\n  h1 {\\n    font-size: 28px;\\n  }\\n  h2 {\\n    font-size: 24px;\\n    line-height: 36px;\\n    margin: 0 0 30px 0;\\n  }\\n  p {\\n    font-size: 16px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  h1 {\\n    font-size: 25px;\\n  }\\n  h2 {\\n    font-size: 18px;\\n    line-height: 18px;\\n    margin: 0 0 15px 0;\\n  }\\n  p {\\n    font-size: 14px;\\n  }\\n  section {\\n    padding: 20px 15px 20px 15px;\\n  }\\n}\\n/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\\n/* Document\\n   ========================================================================== */\\n/**\\n * 1. Correct the line height in all browsers.\\n * 2. Prevent adjustments of font size after orientation changes in iOS.\\n */\\nhtml {\\n  line-height: 1.15; /* 1 */\\n  -webkit-text-size-adjust: 100%; /* 2 */\\n}\\n\\n/* Sections\\n   ========================================================================== */\\n/**\\n * Remove the margin in all browsers.\\n */\\nbody {\\n  margin: 0;\\n}\\n\\n/**\\n * Render the `main` element consistently in IE.\\n */\\nmain {\\n  display: block;\\n}\\n\\n/**\\n * Correct the font size and margin on `h1` elements within `section` and\\n * `article` contexts in Chrome, Firefox, and Safari.\\n */\\nh1 {\\n  font-size: 2em;\\n  margin: 0.67em 0;\\n}\\n\\n/* Grouping content\\n   ========================================================================== */\\n/**\\n * 1. Add the correct box sizing in Firefox.\\n * 2. Show the overflow in Edge and IE.\\n */\\nhr {\\n  box-sizing: content-box; /* 1 */\\n  height: 0; /* 1 */\\n  overflow: visible; /* 2 */\\n}\\n\\n/**\\n * 1. Correct the inheritance and scaling of font size in all browsers.\\n * 2. Correct the odd `em` font sizing in all browsers.\\n */\\npre {\\n  font-family: monospace, monospace; /* 1 */\\n  font-size: 1em; /* 2 */\\n}\\n\\n/* Text-level semantics\\n   ========================================================================== */\\n/**\\n * Remove the gray background on active links in IE 10.\\n */\\na {\\n  background-color: transparent;\\n}\\n\\n/**\\n * 1. Remove the bottom border in Chrome 57-\\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\\n */\\nabbr[title] {\\n  border-bottom: none; /* 1 */\\n  text-decoration: underline; /* 2 */\\n  text-decoration: underline dotted; /* 2 */\\n}\\n\\n/**\\n * Add the correct font weight in Chrome, Edge, and Safari.\\n */\\nb,\\nstrong {\\n  font-weight: bolder;\\n}\\n\\n/**\\n * 1. Correct the inheritance and scaling of font size in all browsers.\\n * 2. Correct the odd `em` font sizing in all browsers.\\n */\\ncode,\\nkbd,\\nsamp {\\n  font-family: monospace, monospace; /* 1 */\\n  font-size: 1em; /* 2 */\\n}\\n\\n/**\\n * Add the correct font size in all browsers.\\n */\\nsmall {\\n  font-size: 80%;\\n}\\n\\n/**\\n * Prevent `sub` and `sup` elements from affecting the line height in\\n * all browsers.\\n */\\nsub,\\nsup {\\n  font-size: 75%;\\n  line-height: 0;\\n  position: relative;\\n  vertical-align: baseline;\\n}\\n\\nsub {\\n  bottom: -0.25em;\\n}\\n\\nsup {\\n  top: -0.5em;\\n}\\n\\n/* Embedded content\\n   ========================================================================== */\\n/**\\n * Remove the border on images inside links in IE 10.\\n */\\nimg {\\n  border-style: none;\\n}\\n\\n/* Forms\\n   ========================================================================== */\\n/**\\n * 1. Change the font styles in all browsers.\\n * 2. Remove the margin in Firefox and Safari.\\n */\\nbutton,\\ninput,\\noptgroup,\\nselect,\\ntextarea {\\n  font-family: inherit; /* 1 */\\n  font-size: 100%; /* 1 */\\n  line-height: 1.15; /* 1 */\\n  margin: 0; /* 2 */\\n}\\n\\n/**\\n * Show the overflow in IE.\\n * 1. Show the overflow in Edge.\\n */\\nbutton,\\ninput { /* 1 */\\n  overflow: visible;\\n}\\n\\n/**\\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\\n * 1. Remove the inheritance of text transform in Firefox.\\n */\\nbutton,\\nselect { /* 1 */\\n  text-transform: none;\\n}\\n\\n/**\\n * Correct the inability to style clickable types in iOS and Safari.\\n */\\nbutton,\\n[type=button],\\n[type=reset],\\n[type=submit] {\\n  -webkit-appearance: button;\\n}\\n\\n/**\\n * Remove the inner border and padding in Firefox.\\n */\\nbutton::-moz-focus-inner,\\n[type=button]::-moz-focus-inner,\\n[type=reset]::-moz-focus-inner,\\n[type=submit]::-moz-focus-inner {\\n  border-style: none;\\n  padding: 0;\\n}\\n\\n/**\\n * Restore the focus styles unset by the previous rule.\\n */\\nbutton:-moz-focusring,\\n[type=button]:-moz-focusring,\\n[type=reset]:-moz-focusring,\\n[type=submit]:-moz-focusring {\\n  outline: 1px dotted ButtonText;\\n}\\n\\n/**\\n * Correct the padding in Firefox.\\n */\\nfieldset {\\n  padding: 0.35em 0.75em 0.625em;\\n}\\n\\n/**\\n * 1. Correct the text wrapping in Edge and IE.\\n * 2. Correct the color inheritance from `fieldset` elements in IE.\\n * 3. Remove the padding so developers are not caught out when they zero out\\n *    `fieldset` elements in all browsers.\\n */\\nlegend {\\n  box-sizing: border-box; /* 1 */\\n  color: inherit; /* 2 */\\n  display: table; /* 1 */\\n  max-width: 100%; /* 1 */\\n  padding: 0; /* 3 */\\n  white-space: normal; /* 1 */\\n}\\n\\n/**\\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\\n */\\nprogress {\\n  vertical-align: baseline;\\n}\\n\\n/**\\n * Remove the default vertical scrollbar in IE 10+.\\n */\\ntextarea {\\n  overflow: auto;\\n}\\n\\n/**\\n * 1. Add the correct box sizing in IE 10.\\n * 2. Remove the padding in IE 10.\\n */\\n[type=checkbox],\\n[type=radio] {\\n  box-sizing: border-box; /* 1 */\\n  padding: 0; /* 2 */\\n}\\n\\n/**\\n * Correct the cursor style of increment and decrement buttons in Chrome.\\n */\\n[type=number]::-webkit-inner-spin-button,\\n[type=number]::-webkit-outer-spin-button {\\n  height: auto;\\n}\\n\\n/**\\n * 1. Correct the odd appearance in Chrome and Safari.\\n * 2. Correct the outline style in Safari.\\n */\\n[type=search] {\\n  -webkit-appearance: textfield; /* 1 */\\n  outline-offset: -2px; /* 2 */\\n}\\n\\n/**\\n * Remove the inner padding in Chrome and Safari on macOS.\\n */\\n[type=search]::-webkit-search-decoration {\\n  -webkit-appearance: none;\\n}\\n\\n/**\\n * 1. Correct the inability to style clickable types in iOS and Safari.\\n * 2. Change font properties to `inherit` in Safari.\\n */\\n::-webkit-file-upload-button {\\n  -webkit-appearance: button; /* 1 */\\n  font: inherit; /* 2 */\\n}\\n\\n/* Interactive\\n   ========================================================================== */\\n/*\\n * Add the correct display in Edge, IE 10+, and Firefox.\\n */\\ndetails {\\n  display: block;\\n}\\n\\n/*\\n * Add the correct display in all browsers.\\n */\\nsummary {\\n  display: list-item;\\n}\\n\\n/* Misc\\n   ========================================================================== */\\n/**\\n * Add the correct display in IE 10+.\\n */\\ntemplate {\\n  display: none;\\n}\\n\\n/**\\n * Add the correct display in IE 10.\\n */\\n[hidden] {\\n  display: none;\\n}\\n\\n.admin-layout {\\n  display: flex;\\n  min-height: 100vh;\\n}\\n\\n.admin-sidebar {\\n  width: 250px;\\n  background: linear-gradient(135deg, #6C0287, #CD06FF);\\n  color: white;\\n  padding: 20px 0;\\n  position: fixed;\\n  height: 100vh;\\n  overflow-y: auto;\\n}\\n\\n.admin-sidebar__title {\\n  padding: 0 20px 30px;\\n  font-size: 24px;\\n  font-weight: bold;\\n  border-bottom: 1px solid rgba(255, 255, 255, 0.2);\\n}\\n\\n.admin-nav {\\n  padding: 20px 0;\\n}\\n\\n.admin-nav__item {\\n  display: block;\\n  padding: 12px 20px;\\n  color: white;\\n  text-decoration: none;\\n  transition: background-color 0.2s;\\n}\\n\\n.admin-nav__item:hover,\\n.admin-nav__item--active {\\n  background-color: rgba(255, 255, 255, 0.1);\\n}\\n\\n.admin-content {\\n  margin-left: 250px;\\n  flex: 1;\\n  padding: 30px;\\n}\\n\\n.admin-header {\\n  background: white;\\n  padding: 20px;\\n  border-radius: 8px;\\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\\n  margin-bottom: 30px;\\n}\\n\\n.admin-header__title {\\n  font-size: 28px;\\n  color: #6C0287;\\n  margin-bottom: 5px;\\n}\\n\\n.admin-header__subtitle {\\n  color: #666;\\n  font-size: 14px;\\n}\\n\\n.admin-card {\\n  background: white;\\n  border-radius: 8px;\\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\\n  overflow: hidden;\\n  margin-bottom: 20px;\\n}\\n\\n.admin-card__header {\\n  padding: 20px;\\n  background: #f8f9fa;\\n  border-bottom: 1px solid #eee;\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n}\\n\\n.admin-card__title {\\n  font-size: 18px;\\n  font-weight: 600;\\n}\\n\\n.admin-card__content {\\n  padding: 20px;\\n}\\n\\n.admin-table {\\n  width: 100%;\\n  border-collapse: collapse;\\n}\\n\\n.admin-table th,\\n.admin-table td {\\n  padding: 12px;\\n  text-align: left;\\n  border-bottom: 1px solid #eee;\\n}\\n\\n.admin-table th {\\n  background: #f8f9fa;\\n  font-weight: 600;\\n  color: #666;\\n  font-size: 14px;\\n}\\n\\n.admin-table td {\\n  font-size: 14px;\\n}\\n\\n.btn {\\n  display: inline-block;\\n  padding: 8px 16px;\\n  border: none;\\n  border-radius: 4px;\\n  text-decoration: none;\\n  font-size: 14px;\\n  font-weight: 500;\\n  cursor: pointer;\\n  transition: all 0.2s;\\n  text-align: center;\\n}\\n\\n.btn--primary {\\n  background: #6C0287;\\n  color: white;\\n}\\n\\n.btn--primary:hover {\\n  background: #5a0270;\\n}\\n\\n.btn--secondary {\\n  background: #6c757d;\\n  color: white;\\n}\\n\\n.btn--success {\\n  background: #28a745;\\n  color: white;\\n}\\n\\n.btn--danger {\\n  background: #dc3545;\\n  color: white;\\n}\\n\\n.btn--small {\\n  padding: 4px 8px;\\n  font-size: 12px;\\n}\\n\\n.badge {\\n  display: inline-block;\\n  padding: 4px 8px;\\n  border-radius: 12px;\\n  font-size: 12px;\\n  font-weight: 500;\\n}\\n\\n.badge--success {\\n  background: #d4edda;\\n  color: #155724;\\n}\\n\\n.badge--danger {\\n  background: #f8d7da;\\n  color: #721c24;\\n}\\n\\n.alert {\\n  padding: 15px;\\n  border-radius: 4px;\\n  margin-bottom: 20px;\\n}\\n\\n.alert--success {\\n  background: #d4edda;\\n  color: #155724;\\n  border: 1px solid #c3e6cb;\\n}\\n\\n.stats-grid {\\n  display: grid;\\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\\n  gap: 20px;\\n  margin-bottom: 30px;\\n}\\n\\n.stat-card {\\n  background: white;\\n  padding: 20px;\\n  border-radius: 8px;\\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\\n  text-align: center;\\n}\\n\\n.stat-card__number {\\n  font-size: 32px;\\n  font-weight: bold;\\n  color: #6C0287;\\n  margin-bottom: 5px;\\n}\\n\\n.stat-card__label {\\n  color: #666;\\n  font-size: 14px;\\n}\\n\\n.form-group {\\n  margin-bottom: 20px;\\n}\\n\\n.form-label {\\n  display: block;\\n  margin-bottom: 5px;\\n  font-weight: 500;\\n  color: #333;\\n}\\n\\n.form-input {\\n  width: 100%;\\n  padding: 10px;\\n  border: 1px solid #ddd;\\n  border-radius: 4px;\\n  font-size: 14px;\\n}\\n\\n.form-input:focus {\\n  outline: none;\\n  border-color: #6C0287;\\n  box-shadow: 0 0 0 2px rgba(108, 2, 135, 0.1);\\n}\\n\\n.pagination {\\n  display: flex;\\n  justify-content: center;\\n  margin-top: 20px;\\n}\\n\\n.pagination a,\\n.pagination span {\\n  padding: 8px 12px;\\n  margin: 0 2px;\\n  border: 1px solid #ddd;\\n  border-radius: 4px;\\n  color: #666;\\n  text-decoration: none;\\n}\\n\\n.pagination .current {\\n  background: #6C0287;\\n  color: white;\\n  border-color: #6C0287;\\n}\\n\\n.header {\\n  padding: 30px 0 0 0;\\n}\\n.header.sticky {\\n  position: fixed;\\n  background: var(--main-background-color, #1B1A1B);\\n  top: 0;\\n  width: 100%;\\n  z-index: 111;\\n  padding: 30px 0 30px 0;\\n  animation: slideDown 0.6s forwards;\\n}\\n.header_zindex {\\n  z-index: 99;\\n}\\n\\n.header__container {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n}\\n\\n.header__navigation_open {\\n  display: block;\\n}\\n\\n.header__burger {\\n  display: none;\\n}\\n\\n.header__list {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  gap: 40px;\\n}\\n\\n.header__link-menu {\\n  text-transform: uppercase;\\n  font-weight: 400;\\n  font-size: 22px;\\n  transition: color 0.4s ease;\\n}\\n.header__link-menu:hover {\\n  color: var(--neon-purple, #CD06FF);\\n}\\n\\n.header__callback {\\n  width: 280px;\\n  height: 55px;\\n  border: 3px solid var(--neon-purple, #CD06FF);\\n  border-radius: 10px;\\n  background-color: transparent;\\n  font-weight: 700;\\n  font-size: 22px;\\n  line-height: 30px;\\n  text-transform: uppercase;\\n  color: var(--main-text-color, #FFFFFF);\\n  cursor: pointer;\\n  transition: background-color 0.4s ease;\\n}\\n.header__callback:hover {\\n  background-color: var(--dark-purple, #6C0287);\\n  border: 3px solid var(--dark-purple, #6C0287);\\n  border-radius: 10px;\\n  color: var(--main-text-color, #FFFFFF);\\n}\\n.header__callback:focus {\\n  background-color: var(--dark-purple, #6C0287);\\n  border-radius: 10px;\\n  border: none;\\n  color: var(--main-text-color, #FFFFFF);\\n}\\n.header__callback:active {\\n  background-color: var(--cold-purple, #640AA3);\\n  border: 1px solid var(--black-color, #000000);\\n  border-radius: 10px;\\n  color: var(--main-text-color, #FFFFFF);\\n}\\n.header__callback_visible {\\n  display: block;\\n  position: absolute;\\n  top: calc(100% + 318px);\\n  left: 50%;\\n  transform: translateX(-50%);\\n  z-index: 99;\\n}\\n\\n@keyframes slideDown {\\n  from {\\n    transform: translateY(-100%);\\n  }\\n  to {\\n    transform: translateY(0);\\n  }\\n}\\n.mobile-overlay {\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background-color: var(--main-background-color, #1B1A1B);\\n  opacity: 0.6;\\n  z-index: 1;\\n}\\n\\n@media screen and (max-width: 1320px) {\\n  .header {\\n    padding: 30px 60px 0 60px;\\n  }\\n  .header.sticky {\\n    padding: 30px 60px;\\n  }\\n  .header__list {\\n    gap: 20px;\\n  }\\n  .header__link-menu {\\n    font-size: 18px;\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .header {\\n    padding: 30px 40px 0 40px;\\n    position: relative;\\n  }\\n  .header.sticky {\\n    padding: 30px 40px;\\n  }\\n  .header__logo {\\n    width: 87px;\\n    height: 55px;\\n  }\\n  .header__navigation {\\n    position: absolute;\\n    top: 100%;\\n    left: 0;\\n    right: 0;\\n    display: none;\\n    color: var(--main-text-color, #FFFFFF);\\n    background-color: var(--main-background-color, #1B1A1B);\\n    padding: 45px;\\n    z-index: 1;\\n  }\\n  .header__list {\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n  }\\n  .header__item {\\n    margin-bottom: 10px;\\n    text-transform: uppercase;\\n    font-weight: bold;\\n  }\\n  .header__callback {\\n    width: 229px;\\n    height: 45px;\\n    font-size: 18px;\\n    line-height: 24px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .header {\\n    padding: 20px 20px 0 20px;\\n  }\\n  .header.sticky {\\n    padding: 20px 20px;\\n  }\\n  .header__burger {\\n    display: block;\\n  }\\n  .header__logo {\\n    width: 66px;\\n    height: 42px;\\n  }\\n  .header__link-menu {\\n    font-size: 14px;\\n  }\\n  .header__callback {\\n    display: none;\\n    width: 184px;\\n    height: 37px;\\n    font-size: 14px;\\n    line-height: 24px;\\n  }\\n  .header__callback_visible {\\n    display: block;\\n    position: absolute;\\n    top: calc(100% + 318px);\\n    left: 50%;\\n    transform: translateX(-50%);\\n    z-index: 99;\\n  }\\n  .header__navigation {\\n    padding: 45px 45px 100px 45px;\\n  }\\n}\\n.footer {\\n  position: relative;\\n  overflow: hidden;\\n}\\n\\n.footer__contacts {\\n  padding: 100px 0 80px 0;\\n  position: relative;\\n  z-index: 2;\\n}\\n\\n.footer__title {\\n  text-align: center;\\n  margin-bottom: 80px;\\n  position: relative;\\n  z-index: 2;\\n  opacity: 0;\\n  animation: titleFadeIn 1s ease-out forwards;\\n}\\n.footer__title::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  bottom: -15px;\\n  left: 50%;\\n  transform: translateX(-50%);\\n  width: 80px;\\n  height: 3px;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  border-radius: 2px;\\n  animation: lineExpand 1s ease-out 0.5s forwards;\\n  scale: 0 1;\\n}\\n\\n.footer__content {\\n  display: grid;\\n  grid-template-columns: 1fr 1fr;\\n  gap: 80px;\\n  align-items: start;\\n  position: relative;\\n  z-index: 2;\\n  opacity: 0;\\n  animation: contentSlideIn 1s ease-out 0.3s forwards;\\n}\\n\\n.footer__info {\\n  display: flex;\\n  flex-direction: column;\\n  gap: 50px;\\n}\\n\\n.footer__address {\\n  display: flex;\\n  flex-direction: column;\\n  gap: 30px;\\n  font-style: normal;\\n}\\n\\n.footer__detail {\\n  display: flex;\\n  align-items: flex-start;\\n  gap: 20px;\\n  transition: all 0.3s ease;\\n  padding: 20px;\\n  border-radius: 15px;\\n  background: rgba(255, 255, 255, 0.05);\\n  backdrop-filter: blur(10px);\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n}\\n.footer__detail:hover {\\n  transform: translateX(10px);\\n  background: rgba(255, 255, 255, 0.08);\\n  border-color: rgba(205, 6, 255, 0.3);\\n  box-shadow: 0 10px 30px rgba(205, 6, 255, 0.2);\\n}\\n.footer__detail:hover .footer__icon {\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  color: #FFFFFF;\\n  transform: scale(1.1);\\n}\\n\\n.footer__icon {\\n  width: 50px;\\n  height: 50px;\\n  min-width: 50px;\\n  background: rgba(255, 255, 255, 0.1);\\n  border-radius: 50%;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  color: rgba(255, 255, 255, 0.8);\\n  transition: all 0.3s ease;\\n}\\n.footer__icon svg {\\n  width: 24px;\\n  height: 24px;\\n}\\n\\n.footer__text {\\n  display: flex;\\n  flex-direction: column;\\n  gap: 5px;\\n}\\n\\n.footer__city {\\n  font-size: 18px;\\n  font-weight: 600;\\n  color: #FFFFFF;\\n}\\n\\n.footer__street {\\n  font-size: 16px;\\n  color: rgba(255, 255, 255, 0.8);\\n}\\n\\n.footer__link {\\n  font-size: 18px;\\n  font-weight: 500;\\n  color: #FFFFFF;\\n  text-decoration: none;\\n  transition: color 0.3s ease;\\n  display: flex;\\n  align-items: center;\\n  min-height: 50px;\\n}\\n.footer__link:hover {\\n  color: var(--neon-purple, #CD06FF);\\n}\\n\\n.footer__social {\\n  display: flex;\\n  gap: 20px;\\n  flex-wrap: wrap;\\n  justify-content: center;\\n}\\n\\n.footer__social-item {\\n  opacity: 0;\\n  animation: socialItemAppear 0.6s ease-out forwards;\\n}\\n.footer__social-item:nth-child(1) {\\n  animation-delay: 0.6s;\\n}\\n.footer__social-item:nth-child(2) {\\n  animation-delay: 0.7s;\\n}\\n.footer__social-item:nth-child(3) {\\n  animation-delay: 0.8s;\\n}\\n.footer__social-item:nth-child(4) {\\n  animation-delay: 0.9s;\\n}\\n\\n.footer__social-link {\\n  width: 60px;\\n  height: 60px;\\n  background: rgba(255, 255, 255, 0.1);\\n  border-radius: 50%;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  color: rgba(255, 255, 255, 0.8);\\n  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\\n  text-decoration: none;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.footer__social-link::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n  border-radius: 50%;\\n}\\n.footer__social-link svg {\\n  width: 28px;\\n  height: 28px;\\n  position: relative;\\n  z-index: 1;\\n  transition: transform 0.3s ease;\\n}\\n.footer__social-link:hover {\\n  transform: translateY(-8px) scale(1.1);\\n  box-shadow: 0 15px 35px rgba(205, 6, 255, 0.4);\\n  color: #FFFFFF;\\n}\\n.footer__social-link:hover::before {\\n  opacity: 1;\\n}\\n.footer__social-link:hover svg {\\n  transform: scale(1.1);\\n}\\n.footer__social-link--vk:hover {\\n  box-shadow: 0 15px 35px rgba(70, 130, 180, 0.4);\\n}\\n.footer__social-link--vk:hover::before {\\n  background: linear-gradient(45deg, #4682B4, #5A9BD4);\\n}\\n.footer__social-link--telegram:hover {\\n  box-shadow: 0 15px 35px rgba(46, 134, 193, 0.4);\\n}\\n.footer__social-link--telegram:hover::before {\\n  background: linear-gradient(45deg, #2E86C1, #3498DB);\\n}\\n.footer__social-link--pinterest:hover {\\n  box-shadow: 0 15px 35px rgba(189, 8, 28, 0.4);\\n}\\n.footer__social-link--pinterest:hover::before {\\n  background: linear-gradient(45deg, #BD081C, #E74C3C);\\n}\\n.footer__social-link--other:hover {\\n  box-shadow: 0 15px 35px rgba(52, 152, 219, 0.4);\\n}\\n.footer__social-link--other:hover::before {\\n  background: linear-gradient(45deg, #3498DB, #5DADE2);\\n}\\n\\n.footer__map {\\n  position: relative;\\n  border-radius: 25px;\\n  overflow: hidden;\\n  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);\\n  background: rgba(255, 255, 255, 0.05);\\n  backdrop-filter: blur(10px);\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n  height: 400px;\\n}\\n.footer__map::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n  z-index: 2;\\n  pointer-events: none;\\n}\\n.footer__map:hover::before {\\n  opacity: 1;\\n}\\n\\n.footer__iframe {\\n  width: 100%;\\n  height: 100%;\\n  border: none;\\n  border-radius: 25px;\\n  filter: grayscale(1) contrast(1.2) brightness(0.8);\\n  transition: filter 0.3s ease;\\n}\\n.footer__iframe:hover {\\n  filter: grayscale(0) contrast(1) brightness(1);\\n}\\n\\n.footer__copyright {\\n  background: rgba(0, 0, 0, 0.3);\\n  backdrop-filter: blur(20px);\\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\\n  padding: 30px 0;\\n  position: relative;\\n  z-index: 2;\\n}\\n\\n.footer__copyright-content {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  flex-wrap: wrap;\\n  gap: 20px;\\n}\\n\\n.footer__copyright-text {\\n  font-size: 14px;\\n  color: rgba(255, 255, 255, 0.7);\\n  margin: 0;\\n}\\n\\n.footer__designer-link {\\n  color: var(--neon-purple, #CD06FF);\\n  text-decoration: none;\\n  transition: all 0.3s ease;\\n  position: relative;\\n}\\n.footer__designer-link::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  bottom: -2px;\\n  left: 0;\\n  width: 0;\\n  height: 1px;\\n  background: var(--neon-purple, #CD06FF);\\n  transition: width 0.3s ease;\\n}\\n.footer__designer-link:hover {\\n  color: #FFFFFF;\\n  text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\\n}\\n.footer__designer-link:hover::after {\\n  width: 100%;\\n}\\n\\n@keyframes dotsMove {\\n  0% {\\n    transform: translate(0, 0);\\n  }\\n  100% {\\n    transform: translate(60px, 60px);\\n  }\\n}\\n@keyframes titleFadeIn {\\n  from {\\n    opacity: 0;\\n    transform: translateY(-30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes lineExpand {\\n  from {\\n    scale: 0 1;\\n  }\\n  to {\\n    scale: 1 1;\\n  }\\n}\\n@keyframes contentSlideIn {\\n  from {\\n    opacity: 0;\\n    transform: translateY(50px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes socialItemAppear {\\n  from {\\n    opacity: 0;\\n    transform: translateY(20px) scale(0.8);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0) scale(1);\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .footer__contacts {\\n    padding: 70px 0 60px 0;\\n  }\\n  .footer__title {\\n    margin-bottom: 60px;\\n  }\\n  .footer__content {\\n    grid-template-columns: 1fr;\\n    gap: 60px;\\n  }\\n  .footer__map {\\n    height: 300px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .footer__contacts {\\n    padding: 50px 0 40px 0;\\n  }\\n  .footer__title {\\n    margin-bottom: 40px;\\n  }\\n  .footer__content {\\n    gap: 40px;\\n  }\\n  .footer__info {\\n    gap: 30px;\\n  }\\n  .footer__address {\\n    gap: 20px;\\n  }\\n  .footer__detail {\\n    padding: 15px;\\n    gap: 15px;\\n  }\\n  .footer__icon {\\n    width: 40px;\\n    height: 40px;\\n    min-width: 40px;\\n  }\\n  .footer__icon svg {\\n    width: 20px;\\n    height: 20px;\\n  }\\n  .footer__city {\\n    font-size: 16px;\\n  }\\n  .footer__street,\\n  .footer__link {\\n    font-size: 14px;\\n  }\\n  .footer__social {\\n    gap: 15px;\\n  }\\n  .footer__social-link {\\n    width: 50px;\\n    height: 50px;\\n  }\\n  .footer__social-link svg {\\n    width: 24px;\\n    height: 24px;\\n  }\\n  .footer__map {\\n    height: 250px;\\n    border-radius: 20px;\\n  }\\n  .footer__copyright {\\n    padding: 20px 0;\\n  }\\n  .footer__copyright-content {\\n    flex-direction: column;\\n    text-align: center;\\n    gap: 10px;\\n  }\\n  .footer__copyright-text {\\n    font-size: 12px;\\n  }\\n}\\n.about-us {\\n  padding: 100px 0;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.about-us::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  opacity: 0.5;\\n  animation: patternMove 10s linear infinite;\\n}\\n\\n.about-us__content {\\n  display: grid;\\n  grid-template-columns: 1fr 400px;\\n  grid-template-rows: auto auto;\\n  gap: 60px 80px;\\n  align-items: start;\\n  position: relative;\\n  z-index: 2;\\n}\\n\\n.about-us__gallery {\\n  grid-column: 1/2;\\n  grid-row: 1/3;\\n  display: grid;\\n  grid-template-columns: repeat(13, 1fr);\\n  grid-template-rows: repeat(3, auto);\\n  gap: 10px;\\n  opacity: 0;\\n  animation: galleryAppear 1s ease-out 0.3s forwards;\\n}\\n\\n.about-us__gallery-item {\\n  position: relative;\\n  border-radius: 15px;\\n  overflow: hidden;\\n  cursor: pointer;\\n  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\\n}\\n.about-us__gallery-item::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(135deg, rgba(205, 6, 255, 0.2) 0%, rgba(255, 6, 205, 0.2) 100%);\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n  z-index: 2;\\n}\\n.about-us__gallery-item::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 50%;\\n  left: 50%;\\n  transform: translate(-50%, -50%);\\n  width: 50px;\\n  height: 50px;\\n  background: rgba(255, 255, 255, 0.9);\\n  border-radius: 50%;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  opacity: 0;\\n  transition: all 0.3s ease;\\n  z-index: 3;\\n  font-size: 20px;\\n  color: #1b1a1b;\\n}\\n.about-us__gallery-item:hover {\\n  transform: translateY(-10px) scale(1.05);\\n  box-shadow: 0 20px 40px rgba(205, 6, 255, 0.4);\\n}\\n.about-us__gallery-item:hover::before {\\n  opacity: 1;\\n}\\n.about-us__gallery-item:hover::after {\\n  opacity: 1;\\n  content: \\\"🎮\\\";\\n}\\n.about-us__gallery-item:hover .about-us__image {\\n  transform: scale(1.1);\\n  filter: brightness(1.2);\\n}\\n.about-us__gallery-item:nth-child(1) {\\n  animation: itemFloat 1s ease-out 0.1s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item:nth-child(2) {\\n  animation: itemFloat 1s ease-out 0.2s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item:nth-child(3) {\\n  animation: itemFloat 1s ease-out 0.3s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item:nth-child(4) {\\n  animation: itemFloat 1s ease-out 0.4s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item:nth-child(5) {\\n  animation: itemFloat 1s ease-out 0.5s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item:nth-child(6) {\\n  animation: itemFloat 1s ease-out 0.6s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item:nth-child(7) {\\n  animation: itemFloat 1s ease-out 0.7s forwards;\\n  transform: translateY(50px);\\n}\\n.about-us__gallery-item--vr {\\n  grid-row: 1/2;\\n  grid-column: 1/7;\\n}\\n.about-us__gallery-item--games {\\n  grid-row: 1/2;\\n  grid-column: 7/13;\\n}\\n.about-us__gallery-item--fifa {\\n  grid-row: 2/3;\\n  grid-column: 1/4;\\n}\\n.about-us__gallery-item--pad {\\n  grid-row: 2/3;\\n  grid-column: 4/8;\\n}\\n.about-us__gallery-item--controller {\\n  grid-row: 2/3;\\n  grid-column: 8/13;\\n}\\n.about-us__gallery-item--karaoke {\\n  grid-row: 3/4;\\n  grid-column: 1/9;\\n}\\n.about-us__gallery-item--vr2 {\\n  grid-row: 3/4;\\n  grid-column: 9/13;\\n}\\n\\n.about-us__image {\\n  width: 100%;\\n  height: 100%;\\n  object-fit: cover;\\n  transition: all 0.5s ease;\\n}\\n\\n.about-us__text {\\n  grid-column: 2/3;\\n  grid-row: 1/2;\\n  background: rgba(255, 255, 255, 0.05);\\n  backdrop-filter: blur(10px);\\n  border-radius: 20px;\\n  padding: 40px;\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n  opacity: 0;\\n  animation: textSlideIn 1s ease-out 0.6s forwards;\\n}\\n\\n.about-us__description {\\n  font-size: 18px;\\n  line-height: 28px;\\n  margin: 0 0 20px 0;\\n  color: rgba(255, 255, 255, 0.9);\\n  transition: color 0.3s ease;\\n}\\n.about-us__description:last-child {\\n  margin: 0;\\n}\\n.about-us__description:hover {\\n  color: #FFFFFF;\\n}\\n\\n.about-us__quote {\\n  grid-column: 2/3;\\n  grid-row: 2/3;\\n  background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\\n  backdrop-filter: blur(15px);\\n  border-radius: 25px;\\n  padding: 40px;\\n  border: 2px solid rgba(205, 6, 255, 0.2);\\n  position: relative;\\n  opacity: 0;\\n  animation: quoteAppear 1s ease-out 0.9s forwards;\\n}\\n.about-us__quote::before {\\n  content: '\\\"';\\n  position: absolute;\\n  top: -20px;\\n  left: 30px;\\n  font-size: 80px;\\n  color: rgba(205, 6, 255, 0.3);\\n  font-family: serif;\\n  line-height: 1;\\n}\\n\\n.about-us__quote-text {\\n  font-size: 20px;\\n  line-height: 30px;\\n  margin: 0 0 30px 0;\\n  font-style: italic;\\n  color: #FFFFFF;\\n}\\n\\n.about-us__quote-highlight {\\n  color: var(--neon-purple, #CD06FF);\\n  font-weight: 700;\\n  text-transform: uppercase;\\n  text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\\n}\\n\\n.about-us__cite {\\n  display: flex;\\n  align-items: center;\\n  gap: 15px;\\n  font-style: normal;\\n}\\n\\n.about-us__author-photo {\\n  width: 60px;\\n  height: 60px;\\n  border-radius: 50%;\\n  object-fit: cover;\\n  border: 3px solid var(--neon-purple, #CD06FF);\\n  box-shadow: 0 0 20px rgba(205, 6, 255, 0.3);\\n}\\n\\n.about-us__author {\\n  font-size: 16px;\\n  color: rgba(255, 255, 255, 0.8);\\n  line-height: 22px;\\n}\\n\\n@keyframes patternMove {\\n  0% {\\n    transform: translateX(0);\\n  }\\n  100% {\\n    transform: translateX(4px);\\n  }\\n}\\n@keyframes titleAppear {\\n  from {\\n    opacity: 0;\\n    transform: translateY(-30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes lineExpand {\\n  from {\\n    scale: 0 1;\\n  }\\n  to {\\n    scale: 1 1;\\n  }\\n}\\n@keyframes galleryAppear {\\n  from {\\n    opacity: 0;\\n    transform: translateX(-50px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateX(0);\\n  }\\n}\\n@keyframes itemFloat {\\n  from {\\n    transform: translateY(50px);\\n    opacity: 0;\\n  }\\n  to {\\n    transform: translateY(0);\\n    opacity: 1;\\n  }\\n}\\n@keyframes textSlideIn {\\n  from {\\n    opacity: 0;\\n    transform: translateX(50px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateX(0);\\n  }\\n}\\n@keyframes quoteAppear {\\n  from {\\n    opacity: 0;\\n    transform: translateY(30px) scale(0.95);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0) scale(1);\\n  }\\n}\\n@media screen and (max-width: 1320px) {\\n  .about-us {\\n    padding: 70px 0;\\n  }\\n  .about-us__content {\\n    grid-template-columns: 1fr 350px;\\n    gap: 40px 60px;\\n  }\\n  .about-us__text {\\n    padding: 30px;\\n  }\\n  .about-us__description {\\n    font-size: 16px;\\n    line-height: 24px;\\n  }\\n  .about-us__quote {\\n    padding: 30px;\\n  }\\n  .about-us__quote-text {\\n    font-size: 18px;\\n    line-height: 26px;\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .about-us {\\n    padding: 50px 0;\\n  }\\n  .about-us__content {\\n    grid-template-columns: 400px 1fr;\\n    grid-template-rows: auto auto auto;\\n    gap: 30px;\\n  }\\n  .about-us__gallery {\\n    grid-column: 1/2;\\n    grid-row: 1/4;\\n  }\\n  .about-us__text {\\n    grid-column: 2/3;\\n    grid-row: 1/2;\\n    padding: 25px;\\n  }\\n  .about-us__quote {\\n    grid-column: 2/3;\\n    grid-row: 2/3;\\n    padding: 25px;\\n  }\\n  .about-us__description {\\n    font-size: 14px;\\n    line-height: 20px;\\n  }\\n  .about-us__quote-text {\\n    font-size: 16px;\\n    line-height: 22px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .about-us {\\n    padding: 30px 0;\\n  }\\n  .about-us__title {\\n    margin-bottom: 40px;\\n  }\\n  .about-us__content {\\n    grid-template-columns: 1fr;\\n    grid-template-rows: auto auto auto;\\n    gap: 30px;\\n  }\\n  .about-us__gallery {\\n    grid-column: 1/2;\\n    grid-row: 2/3;\\n    max-width: 280px;\\n    justify-self: center;\\n  }\\n  .about-us__text {\\n    grid-column: 1/2;\\n    grid-row: 1/2;\\n    padding: 20px;\\n  }\\n  .about-us__quote {\\n    grid-column: 1/2;\\n    grid-row: 3/4;\\n    padding: 20px;\\n  }\\n  .about-us__quote::before {\\n    font-size: 60px;\\n    top: -15px;\\n    left: 20px;\\n  }\\n  .about-us__description {\\n    font-size: 12px;\\n    line-height: 16px;\\n    margin: 0 0 15px 0;\\n  }\\n  .about-us__quote-text {\\n    font-size: 14px;\\n    line-height: 18px;\\n    margin: 0 0 20px 0;\\n  }\\n  .about-us__author-photo {\\n    width: 50px;\\n    height: 50px;\\n  }\\n  .about-us__author {\\n    font-size: 14px;\\n    line-height: 18px;\\n  }\\n}\\n.booking {\\n  padding: 80px 0;\\n}\\n\\n.booking__form {\\n  max-width: 1200px;\\n  margin: 0 auto;\\n}\\n\\n.booking__fieldset {\\n  border: none;\\n  margin: 0 0 40px 0;\\n  padding: 0;\\n}\\n.booking__fieldset--halls {\\n  margin-bottom: 60px;\\n}\\n\\n.booking__legend {\\n  font-size: 32px;\\n  font-weight: 600;\\n  color: #FFFFFF;\\n  margin-bottom: 30px;\\n  text-align: center;\\n  width: 100%;\\n}\\n\\n.booking__halls {\\n  display: grid;\\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\\n  gap: 20px;\\n  margin-bottom: 40px;\\n}\\n\\n.booking__hall-label {\\n  position: relative;\\n  cursor: pointer;\\n  display: block;\\n  height: 200px;\\n  border-radius: 15px;\\n  overflow: hidden;\\n  transition: all 0.3s ease;\\n}\\n.booking__hall-label:hover {\\n  transform: translateY(-5px);\\n  box-shadow: 0 15px 40px rgba(205, 6, 255, 0.3);\\n}\\n\\n.booking__hall-input {\\n  position: absolute;\\n  opacity: 0;\\n  pointer-events: none;\\n}\\n.booking__hall-input:checked + .booking__hall-visual {\\n  border: 3px solid #CD06FF;\\n  box-shadow: 0 0 30px rgba(205, 6, 255, 0.6);\\n  transform: scale(1.02);\\n}\\n.booking__hall-input:checked + .booking__hall-visual::after {\\n  opacity: 1;\\n}\\n.booking__hall-input--80s-vibes + .booking__hall-visual {\\n  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\\\"../img/rooms/80s-vibes.jpg\\\");\\n  background-size: cover;\\n  background-position: center;\\n}\\n.booking__hall-input--star-wars + .booking__hall-visual {\\n  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\\\"../img/rooms/star-wars.jpg\\\");\\n  background-size: cover;\\n  background-position: center;\\n}\\n.booking__hall-input--wild-west + .booking__hall-visual {\\n  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\\\"../img/rooms/wild-west.jpg\\\");\\n  background-size: cover;\\n  background-position: center;\\n}\\n.booking__hall-input--neon-style + .booking__hall-visual {\\n  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\\\"../img/rooms/neon-style.jpg\\\");\\n  background-size: cover;\\n  background-position: center;\\n}\\n\\n.booking__hall-visual {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  height: 100%;\\n  border: 2px solid transparent;\\n  border-radius: 15px;\\n  font-size: 24px;\\n  font-weight: 700;\\n  color: #FFFFFF;\\n  text-transform: uppercase;\\n  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\\n  transition: all 0.3s ease;\\n  position: relative;\\n}\\n.booking__hall-visual::after {\\n  content: \\\"✓\\\";\\n  position: absolute;\\n  top: 15px;\\n  right: 15px;\\n  width: 30px;\\n  height: 30px;\\n  background: #CD06FF;\\n  border-radius: 50%;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  font-size: 18px;\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n}\\n\\n.booking__content {\\n  background: rgba(255, 255, 255, 0.05);\\n  border-radius: 20px;\\n  padding: 40px;\\n  backdrop-filter: blur(10px);\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n}\\n\\n.booking__sub-fieldset {\\n  border: none;\\n  margin: 0 0 30px 0;\\n  padding: 0;\\n}\\n\\n.booking__sub-legend {\\n  font-size: 20px;\\n  font-weight: 500;\\n  color: #FFFFFF;\\n  margin-bottom: 15px;\\n}\\n\\n.booking__options {\\n  display: flex;\\n  flex-wrap: wrap;\\n  gap: 15px;\\n}\\n\\n.booking__option-label {\\n  position: relative;\\n  cursor: pointer;\\n}\\n\\n.booking__option-input {\\n  position: absolute;\\n  opacity: 0;\\n  pointer-events: none;\\n}\\n.booking__option-input:checked + .booking__option-text {\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  color: #FFFFFF;\\n  transform: scale(1.05);\\n  box-shadow: 0 5px 15px rgba(205, 6, 255, 0.4);\\n}\\n\\n.booking__option-text {\\n  display: block;\\n  padding: 12px 20px;\\n  background: rgba(255, 255, 255, 0.1);\\n  border: 1px solid rgba(255, 255, 255, 0.2);\\n  border-radius: 25px;\\n  color: #FFFFFF;\\n  font-size: 16px;\\n  transition: all 0.3s ease;\\n}\\n.booking__option-text:hover {\\n  background: rgba(255, 255, 255, 0.15);\\n  transform: translateY(-2px);\\n}\\n\\n.booking__fieldset--datetime {\\n  margin-top: 40px;\\n}\\n\\n.booking__datetime {\\n  display: grid;\\n  grid-template-columns: 1fr 1fr;\\n  gap: 40px;\\n}\\n\\n.booking__selects,\\n.booking__inputs {\\n  display: flex;\\n  flex-direction: column;\\n  gap: 20px;\\n}\\n\\n.booking__select-label,\\n.booking__input-label {\\n  display: flex;\\n  flex-direction: column;\\n  gap: 8px;\\n}\\n\\n.booking__input-text {\\n  font-size: 16px;\\n  color: #FFFFFF;\\n  font-weight: 500;\\n}\\n\\n.booking__select,\\n.booking__input {\\n  padding: 15px 20px;\\n  background: rgba(255, 255, 255, 0.1);\\n  border: 1px solid rgba(255, 255, 255, 0.2);\\n  border-radius: 10px;\\n  color: #FFFFFF;\\n  font-size: 16px;\\n  transition: all 0.3s ease;\\n}\\n.booking__select:focus,\\n.booking__input:focus {\\n  outline: none;\\n  border-color: #CD06FF;\\n  box-shadow: 0 0 15px rgba(205, 6, 255, 0.3);\\n  background: rgba(255, 255, 255, 0.15);\\n}\\n.booking__select::placeholder,\\n.booking__input::placeholder {\\n  color: rgba(255, 255, 255, 0.6);\\n}\\n\\n.booking__select {\\n  cursor: pointer;\\n}\\n.booking__select option {\\n  background: #1b1a1b;\\n  color: #FFFFFF;\\n}\\n\\n.booking__submit {\\n  width: 100%;\\n  max-width: 400px;\\n  margin: 40px auto 0;\\n  display: block;\\n  padding: 18px 40px;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  border: none;\\n  border-radius: 50px;\\n  color: #FFFFFF;\\n  font-size: 20px;\\n  font-weight: 700;\\n  text-transform: uppercase;\\n  cursor: pointer;\\n  transition: all 0.3s ease;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.booking__submit::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: -100%;\\n  width: 100%;\\n  height: 100%;\\n  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);\\n  transition: left 0.5s ease;\\n}\\n.booking__submit:hover {\\n  transform: translateY(-3px);\\n  box-shadow: 0 15px 40px rgba(205, 6, 255, 0.4);\\n}\\n.booking__submit:hover::before {\\n  left: 100%;\\n}\\n.booking__submit:active {\\n  transform: translateY(-1px);\\n}\\n\\n.booking__message {\\n  padding: 15px 20px;\\n  margin-bottom: 20px;\\n  border-radius: 5px;\\n}\\n.booking__message--success {\\n  background-color: #4caf50;\\n  color: white;\\n}\\n.booking__message--error {\\n  background-color: #f44336;\\n  color: white;\\n}\\n\\n@keyframes glow {\\n  from {\\n    text-shadow: 0 0 20px rgba(205, 6, 255, 0.5);\\n  }\\n  to {\\n    text-shadow: 0 0 30px rgba(205, 6, 255, 0.8), 0 0 40px rgba(255, 6, 205, 0.3);\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .booking {\\n    padding: 60px 0;\\n  }\\n  .booking__title {\\n    font-size: 36px;\\n    margin-bottom: 40px;\\n  }\\n  .booking__content {\\n    padding: 30px;\\n  }\\n  .booking__datetime {\\n    grid-template-columns: 1fr;\\n    gap: 30px;\\n  }\\n  .booking__halls {\\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\\n  }\\n  .booking__hall-visual {\\n    font-size: 20px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .booking {\\n    padding: 40px 0;\\n  }\\n  .booking__title {\\n    font-size: 28px;\\n    margin-bottom: 30px;\\n  }\\n  .booking__legend {\\n    font-size: 24px;\\n    margin-bottom: 20px;\\n  }\\n  .booking__content {\\n    padding: 20px;\\n  }\\n  .booking__halls {\\n    grid-template-columns: 1fr;\\n    gap: 15px;\\n  }\\n  .booking__hall-label {\\n    height: 150px;\\n  }\\n  .booking__hall-visual {\\n    font-size: 18px;\\n  }\\n  .booking__options {\\n    gap: 10px;\\n  }\\n  .booking__option-text {\\n    padding: 10px 16px;\\n    font-size: 14px;\\n  }\\n  .booking__select,\\n  .booking__input {\\n    padding: 12px 16px;\\n    font-size: 14px;\\n  }\\n  .booking__submit {\\n    font-size: 18px;\\n    padding: 15px 30px;\\n  }\\n}\\n.entertainment {\\n  padding: 80px 0;\\n  position: relative;\\n}\\n\\n.entertainment__list {\\n  display: flex;\\n  flex-wrap: wrap;\\n  justify-content: center;\\n  gap: 40px 20px;\\n  align-items: flex-end;\\n  margin: 0 0 70px 0;\\n  position: relative;\\n  z-index: 2;\\n}\\n\\n.entertainment__item {\\n  display: flex;\\n  position: relative;\\n  width: 380px;\\n  height: 228px;\\n  flex-basis: 380px;\\n  border-radius: 20px;\\n  overflow: hidden;\\n  cursor: pointer;\\n  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\\n  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);\\n  backdrop-filter: blur(10px);\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n  opacity: 0;\\n  transform: translateY(50px);\\n}\\n.entertainment__item::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(108, 2, 135, 0.1) 100%);\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n  z-index: 1;\\n}\\n.entertainment__item::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: -50%;\\n  left: -50%;\\n  width: 200%;\\n  height: 200%;\\n  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);\\n  transform: rotate(45deg);\\n  opacity: 0;\\n  transition: all 0.6s ease;\\n  z-index: 3;\\n}\\n.entertainment__item:hover {\\n  transform: translateY(-15px) scale(1.05);\\n  box-shadow: 0 25px 50px rgba(205, 6, 255, 0.2), 0 15px 30px rgba(108, 2, 135, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n  border-color: rgba(205, 6, 255, 0.3);\\n}\\n.entertainment__item:hover::before {\\n  opacity: 1;\\n}\\n.entertainment__item:hover::after {\\n  top: -100%;\\n  left: -100%;\\n  opacity: 1;\\n}\\n.entertainment__item:hover .entertainment__image {\\n  transform: scale(1.1);\\n  filter: brightness(1.2) saturate(1.3);\\n}\\n.entertainment__item:hover .entertainment__description {\\n  text-shadow: 0 0 20px rgba(205, 6, 255, 0.8);\\n  color: var(--neon-purple, #CD06FF);\\n}\\n.entertainment__item:nth-child(1) {\\n  animation: slideInUp 0.8s ease-out 0.1s forwards;\\n}\\n.entertainment__item:nth-child(2) {\\n  animation: slideInUp 0.8s ease-out 0.2s forwards;\\n}\\n.entertainment__item:nth-child(3) {\\n  animation: slideInUp 0.8s ease-out 0.3s forwards;\\n}\\n.entertainment__item:nth-child(4) {\\n  animation: slideInUp 0.8s ease-out 0.4s forwards;\\n}\\n.entertainment__item:nth-child(5) {\\n  animation: slideInUp 0.8s ease-out 0.5s forwards;\\n}\\n.entertainment__item:nth-child(6) {\\n  animation: slideInUp 0.8s ease-out 0.6s forwards;\\n}\\n.entertainment__item--vr:hover {\\n  box-shadow: 0 25px 50px rgba(0, 255, 255, 0.2), 0 15px 30px rgba(0, 200, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n.entertainment__item--audio:hover {\\n  box-shadow: 0 25px 50px rgba(255, 106, 0, 0.2), 0 15px 30px rgba(255, 140, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n.entertainment__item--karaoke:hover {\\n  box-shadow: 0 25px 50px rgba(255, 20, 147, 0.2), 0 15px 30px rgba(255, 69, 179, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n.entertainment__item--games:hover {\\n  box-shadow: 0 25px 50px rgba(50, 205, 50, 0.2), 0 15px 30px rgba(0, 255, 127, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n.entertainment__item--movies:hover {\\n  box-shadow: 0 25px 50px rgba(255, 215, 0, 0.2), 0 15px 30px rgba(255, 193, 7, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n.entertainment__item--ps:hover {\\n  box-shadow: 0 25px 50px rgba(0, 123, 255, 0.2), 0 15px 30px rgba(52, 144, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n\\n.entertainment__image {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n  object-fit: cover;\\n  transition: all 0.5s ease;\\n  z-index: 1;\\n}\\n\\n.entertainment__description {\\n  position: absolute;\\n  bottom: 0;\\n  left: 0;\\n  right: 0;\\n  padding: 20px 30px 30px;\\n  white-space: pre-line;\\n  font-weight: 700;\\n  font-size: 20px;\\n  line-height: 28px;\\n  color: var(--main-text-color, #FFFFFF);\\n  margin: 0;\\n  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%);\\n  transition: all 0.3s ease;\\n  z-index: 2;\\n  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\\n}\\n\\n@keyframes slideInDown {\\n  from {\\n    opacity: 0;\\n    transform: translateY(-30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes slideInUp {\\n  from {\\n    opacity: 0;\\n    transform: translateY(50px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@media screen and (max-width: 1320px) {\\n  .entertainment {\\n    padding: 60px 0;\\n  }\\n  .entertainment__item {\\n    flex-basis: 287px;\\n    width: 287px;\\n    height: 172px;\\n  }\\n  .entertainment__description {\\n    padding: 15px 20px 20px;\\n    font-size: 18px;\\n    line-height: 24px;\\n  }\\n  .entertainment__list {\\n    gap: 30px 20px;\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .entertainment {\\n    padding: 50px 0;\\n  }\\n  .entertainment__item {\\n    flex-basis: 334px;\\n    width: 334px;\\n    height: 200px;\\n  }\\n  .entertainment__item--audio {\\n    margin: unset;\\n  }\\n  .entertainment__item--movies {\\n    margin: unset;\\n  }\\n  .entertainment__item:hover {\\n    transform: translateY(-10px) scale(1.03);\\n  }\\n  .entertainment__list {\\n    gap: 20px;\\n    margin: 0 0 50px 0;\\n  }\\n  .entertainment__description {\\n    font-size: 16px;\\n    line-height: 22px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .entertainment {\\n    padding: 40px 0;\\n  }\\n  .entertainment__item {\\n    flex-basis: 135px;\\n    width: 135px;\\n    height: 75px;\\n    border-radius: 15px;\\n  }\\n  .entertainment__item--movies {\\n    width: 130px;\\n    white-space: normal;\\n  }\\n  .entertainment__item:hover {\\n    transform: translateY(-5px) scale(1.02);\\n    box-shadow: 0 10px 20px rgba(205, 6, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);\\n  }\\n  .entertainment__description {\\n    padding: 5px 10px 8px;\\n    font-size: 10px;\\n    line-height: 14px;\\n    white-space: normal;\\n  }\\n  .entertainment__title {\\n    margin-bottom: 30px;\\n  }\\n}\\n.faq {\\n  padding: 100px 0;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.faq::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  opacity: 0.5;\\n  animation: verticalMove 12s linear infinite;\\n}\\n\\n.faq__list {\\n  max-width: 800px;\\n  margin: 0 auto;\\n  display: flex;\\n  flex-direction: column;\\n  gap: 20px;\\n  position: relative;\\n  z-index: 2;\\n}\\n\\n.faq__item {\\n  background: rgba(255, 255, 255, 0.05);\\n  backdrop-filter: blur(15px);\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n  border-radius: 20px;\\n  overflow: hidden;\\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\\n  opacity: 0;\\n  transform: translateY(30px);\\n}\\n.faq__item:nth-child(1) {\\n  animation: itemAppear 0.6s ease-out 0.1s forwards;\\n}\\n.faq__item:nth-child(2) {\\n  animation: itemAppear 0.6s ease-out 0.2s forwards;\\n}\\n.faq__item:nth-child(3) {\\n  animation: itemAppear 0.6s ease-out 0.3s forwards;\\n}\\n.faq__item:nth-child(4) {\\n  animation: itemAppear 0.6s ease-out 0.4s forwards;\\n}\\n.faq__item:nth-child(5) {\\n  animation: itemAppear 0.6s ease-out 0.5s forwards;\\n}\\n.faq__item:nth-child(6) {\\n  animation: itemAppear 0.6s ease-out 0.6s forwards;\\n}\\n.faq__item:nth-child(7) {\\n  animation: itemAppear 0.6s ease-out 0.7s forwards;\\n}\\n.faq__item:nth-child(8) {\\n  animation: itemAppear 0.6s ease-out 0.8s forwards;\\n}\\n.faq__item:nth-child(9) {\\n  animation: itemAppear 0.6s ease-out 0.9s forwards;\\n}\\n.faq__item:nth-child(10) {\\n  animation: itemAppear 0.6s ease-out 1s forwards;\\n}\\n.faq__item:hover {\\n  transform: translateY(-5px);\\n  box-shadow: 0 15px 35px rgba(205, 6, 255, 0.2);\\n  border-color: rgba(205, 6, 255, 0.3);\\n}\\n.faq__item--active .faq__button {\\n  background: linear-gradient(135deg, rgba(205, 6, 255, 0.2) 0%, rgba(255, 6, 205, 0.2) 100%);\\n  color: #FFFFFF;\\n}\\n.faq__item--active .faq__icon {\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  color: #FFFFFF;\\n  transform: rotate(45deg);\\n}\\n.faq__item--active .faq__path--vertical {\\n  opacity: 0;\\n}\\n.faq__item--active .faq__content {\\n  max-height: 200px;\\n  padding: 30px;\\n  opacity: 1;\\n}\\n\\n.faq__button {\\n  width: 100%;\\n  background: transparent;\\n  border: none;\\n  padding: 25px 30px;\\n  display: flex;\\n  align-items: center;\\n  justify-content: space-between;\\n  gap: 20px;\\n  cursor: pointer;\\n  transition: all 0.3s ease;\\n  text-align: left;\\n  position: relative;\\n}\\n.faq__button::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n}\\n.faq__button:hover::before {\\n  opacity: 1;\\n}\\n.faq__button:hover .faq__question {\\n  color: var(--neon-purple, #CD06FF);\\n}\\n.faq__button:hover .faq__icon {\\n  transform: scale(1.1);\\n  background: rgba(205, 6, 255, 0.2);\\n}\\n\\n.faq__question {\\n  font-size: 20px;\\n  font-weight: 600;\\n  color: #FFFFFF;\\n  transition: color 0.3s ease;\\n  position: relative;\\n  z-index: 1;\\n}\\n\\n.faq__icon {\\n  width: 50px;\\n  height: 50px;\\n  border-radius: 50%;\\n  background: rgba(255, 255, 255, 0.1);\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  transition: all 0.4s ease;\\n  flex-shrink: 0;\\n  position: relative;\\n  z-index: 1;\\n}\\n\\n.faq__svg {\\n  width: 24px;\\n  height: 24px;\\n  color: rgba(255, 255, 255, 0.8);\\n  transition: all 0.4s ease;\\n}\\n\\n.faq__path {\\n  transition: all 0.4s ease;\\n  stroke-width: 2;\\n  stroke: currentColor;\\n  fill: none;\\n}\\n\\n.faq__item--active .faq__icon {\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  color: #FFFFFF;\\n  transform: rotate(180deg);\\n}\\n.faq__item--active .faq__svg {\\n  color: #FFFFFF;\\n}\\n\\n.faq__svg {\\n  width: 24px;\\n  height: 24px;\\n  color: rgba(255, 255, 255, 0.8);\\n  transition: color 0.3s ease;\\n}\\n\\n.faq__path {\\n  transition: all 0.3s ease;\\n  stroke-width: 2;\\n  stroke: currentColor;\\n  fill: none;\\n}\\n.faq__path--vertical {\\n  opacity: 1;\\n}\\n.faq__path--horizontal {\\n  opacity: 1;\\n}\\n\\n.faq__content {\\n  max-height: 0;\\n  overflow: hidden;\\n  opacity: 0;\\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\\n  background: rgba(0, 0, 0, 0.2);\\n}\\n\\n.faq__answer {\\n  font-size: 16px;\\n  line-height: 24px;\\n  color: rgba(255, 255, 255, 0.9);\\n  margin: 0;\\n  position: relative;\\n  padding-left: 20px;\\n}\\n.faq__answer::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  left: 0;\\n  top: 0;\\n  width: 4px;\\n  height: 100%;\\n  background: linear-gradient(to bottom, #CD06FF, #FF06CD);\\n  border-radius: 2px;\\n  margin-right: 15px;\\n}\\n\\n@keyframes verticalMove {\\n  0% {\\n    transform: translateY(0);\\n  }\\n  100% {\\n    transform: translateY(52px);\\n  }\\n}\\n@keyframes titleSlideIn {\\n  from {\\n    opacity: 0;\\n    transform: translateY(-30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes lineExpand {\\n  from {\\n    scale: 0 1;\\n  }\\n  to {\\n    scale: 1 1;\\n  }\\n}\\n@keyframes itemAppear {\\n  from {\\n    opacity: 0;\\n    transform: translateY(30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .faq {\\n    padding: 70px 0;\\n  }\\n  .faq__title {\\n    margin-bottom: 60px;\\n  }\\n  .faq__button {\\n    padding: 20px 25px;\\n  }\\n  .faq__question {\\n    font-size: 18px;\\n  }\\n  .faq__icon {\\n    width: 45px;\\n    height: 45px;\\n  }\\n  .faq__svg {\\n    width: 20px;\\n    height: 20px;\\n  }\\n  .faq__answer {\\n    font-size: 15px;\\n    line-height: 22px;\\n  }\\n  .faq__item--active .faq__content {\\n    padding: 25px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .faq {\\n    padding: 50px 0;\\n  }\\n  .faq__title {\\n    margin-bottom: 40px;\\n  }\\n  .faq__list {\\n    gap: 15px;\\n  }\\n  .faq__button {\\n    padding: 18px 20px;\\n    gap: 15px;\\n  }\\n  .faq__question {\\n    font-size: 16px;\\n  }\\n  .faq__icon {\\n    width: 40px;\\n    height: 40px;\\n  }\\n  .faq__svg {\\n    width: 18px;\\n    height: 18px;\\n  }\\n  .faq__answer {\\n    font-size: 14px;\\n    line-height: 20px;\\n    padding-left: 15px;\\n  }\\n  .faq__answer::before {\\n    width: 3px;\\n  }\\n  .faq__item--active .faq__content {\\n    padding: 0 20px 20px;\\n  }\\n}\\n.feedbacks {\\n  padding: 100px 0;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.feedbacks::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  opacity: 0.5;\\n  animation: linesMove 15s linear infinite;\\n}\\n\\n.feedbacks__slider {\\n  position: relative;\\n  max-width: 800px;\\n  margin: 0 auto;\\n  z-index: 2;\\n}\\n\\n.feedbacks__wrapper {\\n  overflow: hidden;\\n  border-radius: 25px;\\n  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);\\n  position: relative;\\n}\\n.feedbacks__wrapper::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);\\n  border-radius: 25px;\\n  z-index: 1;\\n  pointer-events: none;\\n}\\n\\n.feedbacks__track {\\n  display: flex;\\n  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);\\n}\\n\\n.feedbacks__slide {\\n  min-width: 100%;\\n  opacity: 0;\\n  animation: slideAppear 1s ease-out 0.8s forwards;\\n}\\n\\n.feedbacks__item {\\n  height: 100%;\\n  background: rgba(255, 255, 255, 0.05);\\n  backdrop-filter: blur(20px);\\n  border: 1px solid rgba(255, 255, 255, 0.1);\\n  border-radius: 25px;\\n  padding: 50px;\\n  text-align: center;\\n  position: relative;\\n  z-index: 2;\\n}\\n.feedbacks__item::before {\\n  content: '\\\"';\\n  position: absolute;\\n  top: -20px;\\n  left: 50%;\\n  transform: translateX(-50%);\\n  font-size: 120px;\\n  color: rgba(205, 6, 255, 0.2);\\n  font-family: serif;\\n  line-height: 1;\\n  z-index: -1;\\n}\\n\\n.feedbacks__photo {\\n  margin: 0 0 30px 0;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  gap: 20px;\\n}\\n\\n.feedbacks__image {\\n  width: 100px;\\n  height: 100px;\\n  border-radius: 50%;\\n  object-fit: cover;\\n  border: 4px solid transparent;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  background-clip: padding-box;\\n  box-shadow: 0 0 30px rgba(205, 6, 255, 0.4), inset 0 0 0 4px rgba(255, 255, 255, 0.1);\\n  transition: all 0.3s ease;\\n  position: relative;\\n}\\n.feedbacks__image::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: -8px;\\n  left: -8px;\\n  right: -8px;\\n  bottom: -8px;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  border-radius: 50%;\\n  z-index: -1;\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n}\\n.feedbacks__image:hover {\\n  transform: scale(1.1);\\n}\\n.feedbacks__image:hover::before {\\n  opacity: 1;\\n}\\n\\n.feedbacks__name {\\n  font-size: 24px;\\n  font-weight: 700;\\n  color: #FFFFFF;\\n  margin: 0;\\n  text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\\n  position: relative;\\n}\\n.feedbacks__name::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  bottom: -8px;\\n  left: 50%;\\n  transform: translateX(-50%);\\n  width: 0;\\n  height: 2px;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  transition: width 0.3s ease;\\n}\\n.feedbacks__name:hover::after {\\n  width: 100%;\\n}\\n\\n.feedbacks__text {\\n  font-size: 18px;\\n  line-height: 28px;\\n  color: rgba(255, 255, 255, 0.9);\\n  margin: 0;\\n  font-style: italic;\\n  position: relative;\\n  z-index: 1;\\n}\\n\\n.feedbacks__controls {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  gap: 30px;\\n  margin-top: 40px;\\n}\\n\\n.feedbacks__btn {\\n  width: 60px;\\n  height: 60px;\\n  border: 2px solid rgba(205, 6, 255, 0.3);\\n  border-radius: 50%;\\n  background: rgba(255, 255, 255, 0.05);\\n  backdrop-filter: blur(10px);\\n  color: rgba(255, 255, 255, 0.7);\\n  cursor: pointer;\\n  transition: all 0.3s ease;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.feedbacks__btn::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  opacity: 0;\\n  transition: opacity 0.3s ease;\\n  border-radius: 50%;\\n}\\n.feedbacks__btn:hover {\\n  border-color: #CD06FF;\\n  color: #FFFFFF;\\n  transform: scale(1.1);\\n}\\n.feedbacks__btn:hover::before {\\n  opacity: 0.2;\\n}\\n.feedbacks__btn:active {\\n  transform: scale(0.95);\\n}\\n.feedbacks__btn:disabled {\\n  opacity: 0.3;\\n  cursor: not-allowed;\\n  transform: scale(1);\\n}\\n.feedbacks__btn:disabled:hover::before {\\n  opacity: 0;\\n}\\n\\n.feedbacks__icon {\\n  width: 24px;\\n  height: 24px;\\n  position: relative;\\n  z-index: 1;\\n}\\n\\n.feedbacks__dots {\\n  display: flex;\\n  gap: 15px;\\n  align-items: center;\\n}\\n\\n.feedbacks__dot {\\n  width: 12px;\\n  height: 12px;\\n  border-radius: 50%;\\n  background: rgba(255, 255, 255, 0.3);\\n  cursor: pointer;\\n  transition: all 0.3s ease;\\n  position: relative;\\n}\\n.feedbacks__dot::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: -4px;\\n  left: -4px;\\n  right: -4px;\\n  bottom: -4px;\\n  border: 2px solid transparent;\\n  border-radius: 50%;\\n  transition: border-color 0.3s ease;\\n}\\n.feedbacks__dot:hover {\\n  background: rgba(255, 255, 255, 0.6);\\n  transform: scale(1.2);\\n}\\n.feedbacks__dot--active {\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  transform: scale(1.3);\\n  box-shadow: 0 0 15px rgba(205, 6, 255, 0.6);\\n}\\n.feedbacks__dot--active::before {\\n  border-color: rgba(205, 6, 255, 0.3);\\n}\\n\\n@keyframes linesMove {\\n  0% {\\n    transform: translateX(0);\\n  }\\n  100% {\\n    transform: translateX(102px);\\n  }\\n}\\n@keyframes titleFadeIn {\\n  from {\\n    opacity: 0;\\n    transform: translateY(-30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes lineGrow {\\n  from {\\n    scale: 0 1;\\n  }\\n  to {\\n    scale: 1 1;\\n  }\\n}\\n@keyframes slideAppear {\\n  from {\\n    opacity: 0;\\n    transform: translateY(30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .feedbacks {\\n    padding: 70px 0;\\n  }\\n  .feedbacks__title {\\n    margin-bottom: 60px;\\n  }\\n  .feedbacks__item {\\n    padding: 40px;\\n  }\\n  .feedbacks__image {\\n    width: 80px;\\n    height: 80px;\\n  }\\n  .feedbacks__name {\\n    font-size: 20px;\\n  }\\n  .feedbacks__text {\\n    font-size: 16px;\\n    line-height: 24px;\\n  }\\n  .feedbacks__btn {\\n    width: 50px;\\n    height: 50px;\\n  }\\n  .feedbacks__icon {\\n    width: 20px;\\n    height: 20px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .feedbacks {\\n    padding: 50px 0;\\n  }\\n  .feedbacks__title {\\n    margin-bottom: 40px;\\n  }\\n  .feedbacks__item {\\n    padding: 30px 20px;\\n  }\\n  .feedbacks__item::before {\\n    font-size: 80px;\\n    top: -15px;\\n  }\\n  .feedbacks__image {\\n    width: 70px;\\n    height: 70px;\\n  }\\n  .feedbacks__name {\\n    font-size: 18px;\\n  }\\n  .feedbacks__text {\\n    font-size: 14px;\\n    line-height: 20px;\\n  }\\n  .feedbacks__controls {\\n    gap: 20px;\\n    margin-top: 30px;\\n  }\\n  .feedbacks__btn {\\n    width: 45px;\\n    height: 45px;\\n  }\\n  .feedbacks__icon {\\n    width: 18px;\\n    height: 18px;\\n  }\\n  .feedbacks__dots {\\n    gap: 10px;\\n  }\\n  .feedbacks__dot {\\n    width: 10px;\\n    height: 10px;\\n  }\\n}\\n.main-banner {\\n  position: relative;\\n}\\n.main-banner::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  bottom: 0;\\n  animation: backgroundPulse 8s ease-in-out infinite;\\n}\\n.main-banner__container {\\n  display: flex;\\n  justify-content: center;\\n  position: relative;\\n  z-index: 2;\\n}\\n.main-banner__text-wrap {\\n  position: relative;\\n  height: 823px;\\n  max-width: 1180px;\\n  margin: 0 auto;\\n  flex-basis: 1174px;\\n  padding-top: 100px;\\n}\\n.main-banner__text-wrap:after {\\n  content: \\\"\\\";\\n  background-image: url(\\\"../img/main-banner.png\\\");\\n  background-size: 675px 762px;\\n  width: 675px;\\n  height: 762px;\\n  display: inline-block;\\n  position: absolute;\\n  bottom: -62px;\\n  left: 500px;\\n  opacity: 0.9;\\n  animation: floatImage 6s ease-in-out infinite;\\n  mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 70%, transparent 100%);\\n}\\n.main-banner__subtitle {\\n  text-transform: uppercase;\\n  font-weight: 900;\\n  font-size: 150px;\\n  letter-spacing: -15px;\\n  line-height: 100%;\\n  margin: 0;\\n  padding: 0;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD, #CD06FF);\\n  background-size: 200% 200%;\\n  -webkit-background-clip: text;\\n  background-clip: text;\\n  -webkit-text-fill-color: transparent;\\n  animation: gradientShift 3s ease-in-out infinite;\\n  text-shadow: 0 0 50px rgba(205, 6, 255, 0.5);\\n}\\n.main-banner__title {\\n  font-size: 28px;\\n  padding: 0 0 0 100px;\\n  line-height: 50px;\\n  font-weight: 400;\\n  margin: 0 0 30px 0;\\n  text-align: left;\\n  text-transform: unset;\\n  opacity: 0;\\n  animation: slideInLeft 1s ease-out 0.5s forwards;\\n}\\n.main-banner__advantages {\\n  display: flex;\\n  flex-direction: row;\\n  gap: 40px;\\n  margin: 0 0 150px 0;\\n  opacity: 0;\\n  animation: slideInUp 1s ease-out 1s forwards;\\n}\\n.main-banner__advantage {\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  justify-content: flex-end;\\n  flex-basis: 210px;\\n  transition: transform 0.3s ease;\\n}\\n.main-banner__advantage:hover {\\n  transform: translateY(-10px);\\n}\\n.main-banner__advantage-number {\\n  margin: 0;\\n  padding: 0;\\n  position: relative;\\n  font-weight: 900;\\n  font-size: 100px;\\n  line-height: 141px;\\n  color: var(--neon-purple, #CD06FF);\\n  font-variant: small-caps;\\n  margin: 0;\\n  text-shadow: 0 0 30px rgba(205, 6, 255, 0.8);\\n  animation: numberPulse 2s ease-in-out infinite;\\n}\\n.main-banner__advantage-number::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  bottom: 15px;\\n  left: 50%;\\n  transform: translateX(-50%);\\n  width: 0;\\n  height: 3px;\\n  background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n  transition: width 0.3s ease;\\n}\\n.main-banner__advantage-number:hover::after {\\n  width: 100%;\\n}\\n.main-banner__advantage-text {\\n  margin: 0;\\n  padding: 0;\\n  transition: color 0.3s ease;\\n}\\n.main-banner__advantage:hover .main-banner__advantage-text {\\n  color: var(--neon-purple, #CD06FF);\\n}\\n.main-banner__link {\\n  display: inline-block;\\n  opacity: 0;\\n  animation: slideInUp 1s ease-out 1.5s forwards;\\n}\\n.main-banner__button {\\n  background: linear-gradient(45deg, var(--dark-purple, #6C0287), var(--cold-purple, #640AA3));\\n  border: none;\\n  border-radius: 50px;\\n  width: 374px;\\n  height: 80px;\\n  box-shadow: 0 0 30px rgba(205, 6, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);\\n  font-weight: 700;\\n  font-size: 26px;\\n  line-height: 30px;\\n  text-transform: uppercase;\\n  color: var(--main-text-color, #FFFFFF);\\n  cursor: pointer;\\n  transition: all 0.3s ease;\\n  position: relative;\\n  overflow: hidden;\\n}\\n.main-banner__button::before {\\n  content: \\\"\\\";\\n  position: absolute;\\n  top: 0;\\n  left: -100%;\\n  width: 100%;\\n  height: 100%;\\n  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);\\n  transition: left 0.6s ease;\\n}\\n.main-banner__button:hover {\\n  transform: translateY(-5px);\\n  box-shadow: 0 15px 40px rgba(205, 6, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n}\\n.main-banner__button:hover::before {\\n  left: 100%;\\n}\\n.main-banner__button:focus {\\n  outline: 2px solid var(--neon-purple, #CD06FF);\\n}\\n.main-banner__button:active {\\n  transform: translateY(-2px);\\n  box-shadow: 0 8px 20px rgba(205, 6, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);\\n}\\n.main-banner__scroll {\\n  width: 97px;\\n  height: 97px;\\n  display: inline-block;\\n  position: absolute;\\n  top: 646px;\\n  left: 536px;\\n  z-index: 99;\\n  opacity: 0;\\n  animation: fadeInBounce 1s ease-out 2s forwards;\\n}\\n.main-banner__scroll-icon {\\n  border: 2px solid rgba(255, 255, 255, 0.6);\\n  border-radius: 50%;\\n  transition: all 0.4s ease;\\n  animation: scrollPulse 2s ease-in-out infinite;\\n}\\n.main-banner__scroll-icon:hover {\\n  border-color: var(--neon-purple, #CD06FF);\\n  background: rgba(205, 6, 255, 0.1);\\n  transform: scale(1.1);\\n}\\n.main-banner__scroll-icon:hover .main-banner__scroll-rect {\\n  fill: var(--neon-purple, #CD06FF);\\n}\\n.main-banner__scroll-icon:active {\\n  background: var(--neon-purple, #CD06FF);\\n  border-color: var(--neon-purple, #CD06FF);\\n  transform: scale(0.95);\\n}\\n.main-banner__scroll-icon:active .main-banner__scroll-rect {\\n  fill: var(--main-text-color, #FFFFFF);\\n}\\n.main-banner__scroll-circle {\\n  fill: transparent;\\n}\\n.main-banner__scroll-rect {\\n  fill: rgba(255, 255, 255, 0.8);\\n  transition: fill 0.3s ease;\\n}\\n\\n@keyframes backgroundPulse {\\n  0%, 100% {\\n    opacity: 1;\\n  }\\n  50% {\\n    opacity: 0.7;\\n  }\\n}\\n@keyframes gradientShift {\\n  0%, 100% {\\n    background-position: 0% 50%;\\n  }\\n  50% {\\n    background-position: 100% 50%;\\n  }\\n}\\n@keyframes slideInLeft {\\n  from {\\n    opacity: 0;\\n    transform: translateX(-50px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateX(0);\\n  }\\n}\\n@keyframes slideInUp {\\n  from {\\n    opacity: 0;\\n    transform: translateY(30px);\\n  }\\n  to {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes fadeInBounce {\\n  0% {\\n    opacity: 0;\\n    transform: translateY(20px);\\n  }\\n  60% {\\n    opacity: 1;\\n    transform: translateY(-5px);\\n  }\\n  100% {\\n    opacity: 1;\\n    transform: translateY(0);\\n  }\\n}\\n@keyframes floatImage {\\n  0%, 100% {\\n    transform: translateY(0px) rotate(0deg);\\n  }\\n  50% {\\n    transform: translateY(-20px) rotate(1deg);\\n  }\\n}\\n@keyframes numberPulse {\\n  0%, 100% {\\n    text-shadow: 0 0 30px rgba(205, 6, 255, 0.8);\\n    transform: scale(1);\\n  }\\n  50% {\\n    text-shadow: 0 0 40px rgb(205, 6, 255);\\n    transform: scale(1.02);\\n  }\\n}\\n@keyframes scrollPulse {\\n  0%, 100% {\\n    opacity: 0.8;\\n    transform: translateY(0);\\n  }\\n  50% {\\n    opacity: 1;\\n    transform: translateY(-5px);\\n  }\\n}\\n@media screen and (max-width: 1320px) {\\n  .main-banner {\\n    padding: 30px 60px 40px 60px;\\n  }\\n  .main-banner__text-wrap {\\n    flex-basis: 904px;\\n    height: 583px;\\n  }\\n  .main-banner__text-wrap:after {\\n    background-size: 453px 520px;\\n    width: 453px;\\n    height: 520px;\\n    top: 63px;\\n    left: 459px;\\n  }\\n  .main-banner__subtitle {\\n    font-size: 120px;\\n    letter-spacing: -11px;\\n    margin: 0 0 20px 0;\\n  }\\n  .main-banner__title {\\n    padding: 0 0 0 100px;\\n    font-size: 22px;\\n    line-height: 30px;\\n    margin: 0 0 30px 0;\\n  }\\n  .main-banner__advantages {\\n    margin: 0 0 80px 0;\\n  }\\n  .main-banner__button {\\n    border-radius: 10px;\\n    margin: 0 0 0 40px;\\n    width: 296px;\\n    height: 64px;\\n    font-size: 22px;\\n    line-height: 30px;\\n  }\\n  .main-banner__scroll {\\n    width: 67px;\\n    height: 67px;\\n    top: 471px;\\n    left: 432px;\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .main-banner {\\n    padding: 30px 40px 40px 40px;\\n  }\\n  .main-banner__text-wrap {\\n    flex-basis: 688px;\\n    height: 537px;\\n  }\\n  .main-banner__text-wrap:after {\\n    background-size: 409px 479px;\\n    width: 409px;\\n    height: 479px;\\n    top: 57px;\\n    left: 283px;\\n  }\\n  .main-banner__subtitle {\\n    font-size: 86px;\\n    line-height: 86px;\\n    letter-spacing: -8px;\\n  }\\n  .main-banner__title {\\n    padding: 0 0 0 60px;\\n    font-size: 18px;\\n    line-height: 24px;\\n    margin: 0 0 50px 0;\\n  }\\n  .main-banner__advantages {\\n    gap: 32px;\\n  }\\n  .main-banner__button {\\n    margin: unset;\\n    border-radius: 4px;\\n    width: 214px;\\n    height: 46px;\\n    font-size: 16px;\\n    line-height: 24px;\\n  }\\n  .main-banner__button:hover, .main-banner__button:focus, .main-banner__button:active {\\n    border-radius: 4px;\\n  }\\n  .main-banner__scroll {\\n    display: none;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .main-banner {\\n    padding: 20px 20px 30px 20px;\\n  }\\n  .main-banner__text-wrap {\\n    flex-basis: 280px;\\n    height: 204px;\\n  }\\n  .main-banner__text-wrap:after {\\n    background-size: cover;\\n    width: 161px;\\n    height: 179px;\\n    top: 23px;\\n    left: 119px;\\n  }\\n  .main-banner__subtitle {\\n    font-size: 35px;\\n    line-height: 35px;\\n    letter-spacing: -3px;\\n    margin: 0 0 6px 0;\\n  }\\n  .main-banner__title {\\n    font-size: 10px;\\n    line-height: 14px;\\n    padding: 0 0 0 15px;\\n    margin: 0 0 10px 0;\\n  }\\n  .main-banner__advantages {\\n    margin: 0 0 30px 0;\\n    gap: 20px;\\n  }\\n  .main-banner__button {\\n    margin: unset;\\n    border-radius: 4px;\\n    width: 117px;\\n    height: 27px;\\n    font-size: 10px;\\n    line-height: 12px;\\n  }\\n}\\n.room {\\n  padding: 50px 0 100px 0;\\n}\\n\\n.room__list {\\n  display: flex;\\n  flex-wrap: wrap;\\n  justify-content: center;\\n  gap: 20px;\\n  flex-direction: row;\\n  align-items: center;\\n  list-style-type: none;\\n}\\n\\n.room__item {\\n  background-size: cover;\\n  background-repeat: no-repeat;\\n  width: 580px;\\n  height: 349px;\\n  flex-basis: 580px;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  position: relative;\\n  transition: 0.4s;\\n}\\n.room__item:hover {\\n  transform: scale(1.1);\\n  box-shadow: 0 0 20px 1px var(--dark-purple, #6C0287);\\n}\\n\\n.room__image {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n  object-fit: cover;\\n  z-index: -1;\\n}\\n\\n.room__description {\\n  position: absolute;\\n  text-transform: uppercase;\\n  font-weight: 700;\\n  font-size: 70px;\\n  white-space: pre-line;\\n  text-align: center;\\n  line-height: 80px;\\n  margin: 0;\\n  z-index: 1;\\n}\\n\\n@media screen and (max-width: 1320px) {\\n  .room {\\n    padding: 35px 0 70px 0;\\n  }\\n  .room__list {\\n    gap: 18px;\\n  }\\n  .room__item {\\n    width: 443px;\\n    height: 267px;\\n    flex-basis: 443px;\\n  }\\n  .room__description {\\n    font-size: 50px;\\n    line-height: 60px;\\n  }\\n}\\n@media screen and (max-width: 1023px) {\\n  .room__item {\\n    width: 335px;\\n    height: 200px;\\n    flex-basis: 335px;\\n  }\\n  .room__description {\\n    font-size: 40px;\\n    line-height: 50px;\\n  }\\n}\\n@media screen and (max-width: 767px) {\\n  .room__item {\\n    width: 280px;\\n    height: 168px;\\n  }\\n}\\n@media screen and (max-width: 630px) {\\n  .room {\\n    padding: 15px 20px 30px 20px;\\n  }\\n  .room__item {\\n    flex-basis: 280px;\\n  }\\n  .room__description {\\n    font-size: 26px;\\n    line-height: 34px;\\n  }\\n}\\n.modal {\\n  position: fixed;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n  z-index: 1000;\\n  opacity: 0;\\n  visibility: hidden;\\n  transition: opacity 0.3s ease, visibility 0.3s ease;\\n}\\n.modal--active {\\n  opacity: 1;\\n  visibility: visible;\\n}\\n\\n.modal__overlay {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n  background-color: rgba(0, 0, 0, 0.8);\\n  cursor: pointer;\\n}\\n\\n.modal__content {\\n  position: absolute;\\n  top: 50%;\\n  left: 50%;\\n  transform: translate(-50%, -50%);\\n  background-color: var(--main-background-color, #1B1A1B);\\n  border: 2px solid var(--neon-purple, #CD06FF);\\n  border-radius: 15px;\\n  width: 90%;\\n  max-width: 500px;\\n  max-height: 90vh;\\n  overflow-y: auto;\\n  padding: 40px;\\n}\\n\\n.modal__close {\\n  position: absolute;\\n  top: 20px;\\n  right: 20px;\\n  background: transparent;\\n  border: none;\\n  color: var(--main-text-color, #FFFFFF);\\n  cursor: pointer;\\n  padding: 5px;\\n  transition: color 0.3s ease;\\n}\\n.modal__close:hover {\\n  color: var(--neon-purple, #CD06FF);\\n}\\n\\n.modal__header {\\n  margin-bottom: 30px;\\n  text-align: center;\\n}\\n\\n.modal__title {\\n  font-size: 28px;\\n  font-weight: 700;\\n  color: var(--main-text-color, #FFFFFF);\\n  text-transform: uppercase;\\n}\\n\\n.modal__form-group {\\n  margin-bottom: 20px;\\n}\\n\\n.modal__input {\\n  width: 100%;\\n  height: 50px;\\n  background-color: transparent;\\n  border: 2px solid var(--neon-purple, #CD06FF);\\n  border-radius: 8px;\\n  padding: 15px;\\n  color: var(--main-text-color, #FFFFFF);\\n  font-size: 16px;\\n  transition: border-color 0.3s ease;\\n}\\n.modal__input::placeholder {\\n  color: rgba(255, 255, 255, 0.6);\\n}\\n.modal__input:focus {\\n  outline: none;\\n  border-color: var(--dark-purple, #6C0287);\\n}\\n\\n.modal__textarea {\\n  width: 100%;\\n  background-color: transparent;\\n  border: 2px solid var(--neon-purple, #CD06FF);\\n  border-radius: 8px;\\n  padding: 15px;\\n  color: var(--main-text-color, #FFFFFF);\\n  font-size: 16px;\\n  resize: vertical;\\n  font-family: inherit;\\n  transition: border-color 0.3s ease;\\n}\\n.modal__textarea::placeholder {\\n  color: rgba(255, 255, 255, 0.6);\\n}\\n.modal__textarea:focus {\\n  outline: none;\\n  border-color: var(--dark-purple, #6C0287);\\n}\\n\\n.modal__submit {\\n  width: 100%;\\n  height: 55px;\\n  background-color: transparent;\\n  border: 3px solid var(--neon-purple, #CD06FF);\\n  border-radius: 10px;\\n  color: var(--main-text-color, #FFFFFF);\\n  font-size: 18px;\\n  font-weight: 700;\\n  text-transform: uppercase;\\n  cursor: pointer;\\n  transition: background-color 0.4s ease, border-color 0.4s ease;\\n}\\n.modal__submit:hover {\\n  background-color: var(--dark-purple, #6C0287);\\n  border-color: var(--dark-purple, #6C0287);\\n}\\n.modal__submit:focus {\\n  outline: none;\\n  background-color: var(--dark-purple, #6C0287);\\n  border-color: var(--dark-purple, #6C0287);\\n}\\n.modal__submit:active {\\n  background-color: var(--cold-purple, #640AA3);\\n  border-color: var(--cold-purple, #640AA3);\\n}\\n\\n@media screen and (max-width: 767px) {\\n  .modal__content {\\n    padding: 30px 20px;\\n    width: 95%;\\n  }\\n  .modal__title {\\n    font-size: 24px;\\n  }\\n  .modal__input,\\n  .modal__textarea {\\n    font-size: 14px;\\n  }\\n  .modal__submit {\\n    font-size: 16px;\\n    height: 50px;\\n  }\\n}\",\"@font-face {\\n    font-family: \\\"Inter\\\";\\n    src: url(\\\"../fonts/inter-semibold.woff2\\\") format(\\\"woff2\\\"),\\n    url(\\\"../fonts/inter-semibold.woff\\\") format(\\\"woff\\\");\\n    font-style: normal;\\n    font-weight: 600;\\n}\\n\\n@font-face {\\n    font-family: \\\"Inter\\\";\\n    src: url(\\\"../fonts/inter-bold.woff2\\\") format(\\\"woff2\\\"),\\n    url(\\\"../fonts/inter-bold.woff\\\") format(\\\"woff\\\");\\n    font-style: normal;\\n    font-weight: 700;\\n}\\n\",\"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap');\\n\\nhtml {\\n    box-sizing: border-box;\\n    position: relative;\\n}\\n\\n*,\\n*::before,\\n*::after {\\n    box-sizing: inherit;\\n}\\n\\nbody {\\n    background:\\n        linear-gradient(to bottom, rgba(205, 6, 255, 0.15) 0%, transparent 100%),\\n        linear-gradient(135deg, #1b1a1b 0%, #2a1b2a 50%, #1b1a1b 100%);\\n    color: var(--main-text-color, #FFFFFF);\\n    font-family: Arial, sans-serif;\\n    font-size: 20px;\\n    font-weight: 400;\\n    min-height: 100vh;\\n    margin: 0 auto;\\n}\\n\\nimg, svg {\\n    max-width: 100%;\\n    max-height: 100%;\\n    height: auto;\\n}\\n\\nbutton {\\n    cursor: pointer;\\n}\\n\\na {\\n    color: inherit;\\n    text-decoration: none;\\n}\\n\\nul {\\n    padding: 0;\\n    margin: 0;\\n    list-style: none;\\n}\\n\\nfigure, fieldset {\\n    margin: 0;\\n    border: none;\\n    padding: 0;\\n}\\n\\nsection {\\n    padding: 50px 0 50px 0;\\n}\\n\\nh1 {\\n    font-size: 45px;\\n    text-transform: uppercase;\\n    text-align: center;\\n}\\n\\nh2 {\\n    text-align: center;\\n    text-transform: uppercase;\\n    font-weight: 700;\\n    font-size: 40px;\\n    line-height: 50px;\\n\\n    position: relative;\\n    z-index: 2;\\n    margin-bottom: 80px;\\n    opacity: 0;\\n    animation: titleAppear 1s ease-out forwards;\\n\\n    &::after {\\n        content: '';\\n        position: absolute;\\n        bottom: -15px;\\n        left: 50%;\\n        transform: translateX(-50%);\\n        width: 80px;\\n        height: 3px;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        border-radius: 2px;\\n        animation: lineExpand 1s ease-out 0.5s forwards;\\n        scale: 0 1;\\n    }\\n}\\n\\np {\\n    font-size: 20px;\\n}\\n\\n.container {\\n    max-width: 1180px;\\n    margin: 0 auto;\\n}\\n\\n@media screen and (max-width: 1320px) {\\n    section {\\n        padding: 35px 60px 35px 60px;\\n    }\\n\\n    h1 {\\n        font-size: 35px;\\n    }\\n\\n    h2 {\\n        font-size: 30px;\\n        line-height: 40px;\\n        margin: 0 0 36px 0;\\n    }\\n\\n    p {\\n        font-size: 18px;\\n    }\\n\\n    circle {\\n        stroke: var(--dark-purple, #6C0287);\\n        stroke-width: 1;\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    section {\\n        padding: 35px 40px 35px 40px;\\n    }\\n\\n    h1 {\\n        font-size: 28px;\\n    }\\n\\n    h2 {\\n        font-size: 24px;\\n        line-height: 36px;\\n        margin: 0 0 30px 0;\\n    }\\n\\n    p {\\n        font-size: 16px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    h1 {\\n        font-size: 25px;\\n    }\\n\\n    h2 {\\n        font-size: 18px;\\n        line-height: 18px;\\n        margin: 0 0 15px 0;\\n    }\\n\\n    p {\\n        font-size: 14px;\\n    }\\n\\n    section {\\n        padding: 20px 15px 20px 15px;\\n    }\\n}\\n\",\"/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\\n\\n/* Document\\n   ========================================================================== */\\n\\n/**\\n * 1. Correct the line height in all browsers.\\n * 2. Prevent adjustments of font size after orientation changes in iOS.\\n */\\n\\nhtml {\\n    line-height: 1.15; /* 1 */\\n    -webkit-text-size-adjust: 100%; /* 2 */\\n}\\n\\n/* Sections\\n   ========================================================================== */\\n\\n/**\\n * Remove the margin in all browsers.\\n */\\n\\nbody {\\n    margin: 0;\\n}\\n\\n/**\\n * Render the `main` element consistently in IE.\\n */\\n\\nmain {\\n    display: block;\\n}\\n\\n/**\\n * Correct the font size and margin on `h1` elements within `section` and\\n * `article` contexts in Chrome, Firefox, and Safari.\\n */\\n\\nh1 {\\n    font-size: 2em;\\n    margin: 0.67em 0;\\n}\\n\\n/* Grouping content\\n   ========================================================================== */\\n\\n/**\\n * 1. Add the correct box sizing in Firefox.\\n * 2. Show the overflow in Edge and IE.\\n */\\n\\nhr {\\n    box-sizing: content-box; /* 1 */\\n    height: 0; /* 1 */\\n    overflow: visible; /* 2 */\\n}\\n\\n/**\\n * 1. Correct the inheritance and scaling of font size in all browsers.\\n * 2. Correct the odd `em` font sizing in all browsers.\\n */\\n\\npre {\\n    font-family: monospace, monospace; /* 1 */\\n    font-size: 1em; /* 2 */\\n}\\n\\n/* Text-level semantics\\n   ========================================================================== */\\n\\n/**\\n * Remove the gray background on active links in IE 10.\\n */\\n\\na {\\n    background-color: transparent;\\n}\\n\\n/**\\n * 1. Remove the bottom border in Chrome 57-\\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\\n */\\n\\nabbr[title] {\\n    border-bottom: none; /* 1 */\\n    text-decoration: underline; /* 2 */\\n    text-decoration: underline dotted; /* 2 */\\n}\\n\\n/**\\n * Add the correct font weight in Chrome, Edge, and Safari.\\n */\\n\\nb,\\nstrong {\\n    font-weight: bolder;\\n}\\n\\n/**\\n * 1. Correct the inheritance and scaling of font size in all browsers.\\n * 2. Correct the odd `em` font sizing in all browsers.\\n */\\n\\ncode,\\nkbd,\\nsamp {\\n    font-family: monospace, monospace; /* 1 */\\n    font-size: 1em; /* 2 */\\n}\\n\\n/**\\n * Add the correct font size in all browsers.\\n */\\n\\nsmall {\\n    font-size: 80%;\\n}\\n\\n/**\\n * Prevent `sub` and `sup` elements from affecting the line height in\\n * all browsers.\\n */\\n\\nsub,\\nsup {\\n    font-size: 75%;\\n    line-height: 0;\\n    position: relative;\\n    vertical-align: baseline;\\n}\\n\\nsub {\\n    bottom: -0.25em;\\n}\\n\\nsup {\\n    top: -0.5em;\\n}\\n\\n/* Embedded content\\n   ========================================================================== */\\n\\n/**\\n * Remove the border on images inside links in IE 10.\\n */\\n\\nimg {\\n    border-style: none;\\n}\\n\\n/* Forms\\n   ========================================================================== */\\n\\n/**\\n * 1. Change the font styles in all browsers.\\n * 2. Remove the margin in Firefox and Safari.\\n */\\n\\nbutton,\\ninput,\\noptgroup,\\nselect,\\ntextarea {\\n    font-family: inherit; /* 1 */\\n    font-size: 100%; /* 1 */\\n    line-height: 1.15; /* 1 */\\n    margin: 0; /* 2 */\\n}\\n\\n/**\\n * Show the overflow in IE.\\n * 1. Show the overflow in Edge.\\n */\\n\\nbutton,\\ninput { /* 1 */\\n    overflow: visible;\\n}\\n\\n/**\\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\\n * 1. Remove the inheritance of text transform in Firefox.\\n */\\n\\nbutton,\\nselect { /* 1 */\\n    text-transform: none;\\n}\\n\\n/**\\n * Correct the inability to style clickable types in iOS and Safari.\\n */\\n\\nbutton,\\n[type=\\\"button\\\"],\\n[type=\\\"reset\\\"],\\n[type=\\\"submit\\\"] {\\n    -webkit-appearance: button;\\n}\\n\\n/**\\n * Remove the inner border and padding in Firefox.\\n */\\n\\nbutton::-moz-focus-inner,\\n[type=\\\"button\\\"]::-moz-focus-inner,\\n[type=\\\"reset\\\"]::-moz-focus-inner,\\n[type=\\\"submit\\\"]::-moz-focus-inner {\\n    border-style: none;\\n    padding: 0;\\n}\\n\\n/**\\n * Restore the focus styles unset by the previous rule.\\n */\\n\\nbutton:-moz-focusring,\\n[type=\\\"button\\\"]:-moz-focusring,\\n[type=\\\"reset\\\"]:-moz-focusring,\\n[type=\\\"submit\\\"]:-moz-focusring {\\n    outline: 1px dotted ButtonText;\\n}\\n\\n/**\\n * Correct the padding in Firefox.\\n */\\n\\nfieldset {\\n    padding: 0.35em 0.75em 0.625em;\\n}\\n\\n/**\\n * 1. Correct the text wrapping in Edge and IE.\\n * 2. Correct the color inheritance from `fieldset` elements in IE.\\n * 3. Remove the padding so developers are not caught out when they zero out\\n *    `fieldset` elements in all browsers.\\n */\\n\\nlegend {\\n    box-sizing: border-box; /* 1 */\\n    color: inherit; /* 2 */\\n    display: table; /* 1 */\\n    max-width: 100%; /* 1 */\\n    padding: 0; /* 3 */\\n    white-space: normal; /* 1 */\\n}\\n\\n/**\\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\\n */\\n\\nprogress {\\n    vertical-align: baseline;\\n}\\n\\n/**\\n * Remove the default vertical scrollbar in IE 10+.\\n */\\n\\ntextarea {\\n    overflow: auto;\\n}\\n\\n/**\\n * 1. Add the correct box sizing in IE 10.\\n * 2. Remove the padding in IE 10.\\n */\\n\\n[type=\\\"checkbox\\\"],\\n[type=\\\"radio\\\"] {\\n    box-sizing: border-box; /* 1 */\\n    padding: 0; /* 2 */\\n}\\n\\n/**\\n * Correct the cursor style of increment and decrement buttons in Chrome.\\n */\\n\\n[type=\\\"number\\\"]::-webkit-inner-spin-button,\\n[type=\\\"number\\\"]::-webkit-outer-spin-button {\\n    height: auto;\\n}\\n\\n/**\\n * 1. Correct the odd appearance in Chrome and Safari.\\n * 2. Correct the outline style in Safari.\\n */\\n\\n[type=\\\"search\\\"] {\\n    -webkit-appearance: textfield; /* 1 */\\n    outline-offset: -2px; /* 2 */\\n}\\n\\n/**\\n * Remove the inner padding in Chrome and Safari on macOS.\\n */\\n\\n[type=\\\"search\\\"]::-webkit-search-decoration {\\n    -webkit-appearance: none;\\n}\\n\\n/**\\n * 1. Correct the inability to style clickable types in iOS and Safari.\\n * 2. Change font properties to `inherit` in Safari.\\n */\\n\\n::-webkit-file-upload-button {\\n    -webkit-appearance: button; /* 1 */\\n    font: inherit; /* 2 */\\n}\\n\\n/* Interactive\\n   ========================================================================== */\\n\\n/*\\n * Add the correct display in Edge, IE 10+, and Firefox.\\n */\\n\\ndetails {\\n    display: block;\\n}\\n\\n/*\\n * Add the correct display in all browsers.\\n */\\n\\nsummary {\\n    display: list-item;\\n}\\n\\n/* Misc\\n   ========================================================================== */\\n\\n/**\\n * Add the correct display in IE 10+.\\n */\\n\\ntemplate {\\n    display: none;\\n}\\n\\n/**\\n * Add the correct display in IE 10.\\n */\\n\\n[hidden] {\\n    display: none;\\n}\\n\",\".admin-layout {\\n    display: flex;\\n    min-height: 100vh;\\n}\\n\\n.admin-sidebar {\\n    width: 250px;\\n    background: linear-gradient(135deg, #6C0287, #CD06FF);\\n    color: white;\\n    padding: 20px 0;\\n    position: fixed;\\n    height: 100vh;\\n    overflow-y: auto;\\n}\\n\\n.admin-sidebar__title {\\n    padding: 0 20px 30px;\\n    font-size: 24px;\\n    font-weight: bold;\\n    border-bottom: 1px solid rgba(255,255,255,0.2);\\n}\\n\\n.admin-nav {\\n    padding: 20px 0;\\n}\\n\\n.admin-nav__item {\\n    display: block;\\n    padding: 12px 20px;\\n    color: white;\\n    text-decoration: none;\\n    transition: background-color 0.2s;\\n}\\n\\n.admin-nav__item:hover,\\n.admin-nav__item--active {\\n    background-color: rgba(255,255,255,0.1);\\n}\\n\\n.admin-content {\\n    margin-left: 250px;\\n    flex: 1;\\n    padding: 30px;\\n}\\n\\n.admin-header {\\n    background: white;\\n    padding: 20px;\\n    border-radius: 8px;\\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\\n    margin-bottom: 30px;\\n}\\n\\n.admin-header__title {\\n    font-size: 28px;\\n    color: #6C0287;\\n    margin-bottom: 5px;\\n}\\n\\n.admin-header__subtitle {\\n    color: #666;\\n    font-size: 14px;\\n}\\n\\n.admin-card {\\n    background: white;\\n    border-radius: 8px;\\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\\n    overflow: hidden;\\n    margin-bottom: 20px;\\n}\\n\\n.admin-card__header {\\n    padding: 20px;\\n    background: #f8f9fa;\\n    border-bottom: 1px solid #eee;\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center;\\n}\\n\\n.admin-card__title {\\n    font-size: 18px;\\n    font-weight: 600;\\n}\\n\\n.admin-card__content {\\n    padding: 20px;\\n}\\n\\n.admin-table {\\n    width: 100%;\\n    border-collapse: collapse;\\n}\\n\\n.admin-table th,\\n.admin-table td {\\n    padding: 12px;\\n    text-align: left;\\n    border-bottom: 1px solid #eee;\\n}\\n\\n.admin-table th {\\n    background: #f8f9fa;\\n    font-weight: 600;\\n    color: #666;\\n    font-size: 14px;\\n}\\n\\n.admin-table td {\\n    font-size: 14px;\\n}\\n\\n.btn {\\n    display: inline-block;\\n    padding: 8px 16px;\\n    border: none;\\n    border-radius: 4px;\\n    text-decoration: none;\\n    font-size: 14px;\\n    font-weight: 500;\\n    cursor: pointer;\\n    transition: all 0.2s;\\n    text-align: center;\\n}\\n\\n.btn--primary {\\n    background: #6C0287;\\n    color: white;\\n}\\n\\n.btn--primary:hover {\\n    background: #5a0270;\\n}\\n\\n.btn--secondary {\\n    background: #6c757d;\\n    color: white;\\n}\\n\\n.btn--success {\\n    background: #28a745;\\n    color: white;\\n}\\n\\n.btn--danger {\\n    background: #dc3545;\\n    color: white;\\n}\\n\\n.btn--small {\\n    padding: 4px 8px;\\n    font-size: 12px;\\n}\\n\\n.badge {\\n    display: inline-block;\\n    padding: 4px 8px;\\n    border-radius: 12px;\\n    font-size: 12px;\\n    font-weight: 500;\\n}\\n\\n.badge--success {\\n    background: #d4edda;\\n    color: #155724;\\n}\\n\\n.badge--danger {\\n    background: #f8d7da;\\n    color: #721c24;\\n}\\n\\n.alert {\\n    padding: 15px;\\n    border-radius: 4px;\\n    margin-bottom: 20px;\\n}\\n\\n.alert--success {\\n    background: #d4edda;\\n    color: #155724;\\n    border: 1px solid #c3e6cb;\\n}\\n\\n.stats-grid {\\n    display: grid;\\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\\n    gap: 20px;\\n    margin-bottom: 30px;\\n}\\n\\n.stat-card {\\n    background: white;\\n    padding: 20px;\\n    border-radius: 8px;\\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\\n    text-align: center;\\n}\\n\\n.stat-card__number {\\n    font-size: 32px;\\n    font-weight: bold;\\n    color: #6C0287;\\n    margin-bottom: 5px;\\n}\\n\\n.stat-card__label {\\n    color: #666;\\n    font-size: 14px;\\n}\\n\\n.form-group {\\n    margin-bottom: 20px;\\n}\\n\\n.form-label {\\n    display: block;\\n    margin-bottom: 5px;\\n    font-weight: 500;\\n    color: #333;\\n}\\n\\n.form-input {\\n    width: 100%;\\n    padding: 10px;\\n    border: 1px solid #ddd;\\n    border-radius: 4px;\\n    font-size: 14px;\\n}\\n\\n.form-input:focus {\\n    outline: none;\\n    border-color: #6C0287;\\n    box-shadow: 0 0 0 2px rgba(108, 2, 135, 0.1);\\n}\\n\\n.pagination {\\n    display: flex;\\n    justify-content: center;\\n    margin-top: 20px;\\n}\\n\\n.pagination a,\\n.pagination span {\\n    padding: 8px 12px;\\n    margin: 0 2px;\\n    border: 1px solid #ddd;\\n    border-radius: 4px;\\n    color: #666;\\n    text-decoration: none;\\n}\\n\\n.pagination .current {\\n    background: #6C0287;\\n    color: white;\\n    border-color: #6C0287;\\n}\\n\",\".header {\\n    padding: 30px 0 0 0;\\n\\n    &.sticky {\\n        position: fixed;\\n        background: var(--main-background-color, #1B1A1B);\\n        top: 0;\\n        width: 100%;\\n        z-index: 111;\\n        padding: 30px 0 30px 0;\\n        animation: slideDown 0.6s forwards;\\n    }\\n\\n    &_zindex {\\n        z-index: 99;\\n    }\\n}\\n\\n.header__container {\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center;\\n}\\n\\n.header__navigation {\\n\\n    &_open {\\n        display: block;\\n    }\\n}\\n\\n.header__burger {\\n    display: none;\\n}\\n\\n.header__list {\\n    display: flex;\\n    justify-content: center;\\n    align-items: center;\\n    gap: 40px;\\n}\\n\\n.header__link-menu {\\n    text-transform: uppercase;\\n    font-weight: 400;\\n    font-size: 22px;\\n    transition: color 0.4s ease;\\n\\n    &:hover {\\n        color: var(--neon-purple, #CD06FF);\\n    }\\n}\\n\\n.header__callback {\\n    width: 280px;\\n    height: 55px;\\n    border: 3px solid var(--neon-purple, #CD06FF);\\n    border-radius: 10px;\\n    background-color: transparent;\\n    font-weight: 700;\\n    font-size: 22px;\\n    line-height: 30px;\\n    text-transform: uppercase;\\n    color: var(--main-text-color, #FFFFFF);\\n    cursor: pointer;\\n    transition: background-color 0.4s ease;\\n\\n    &:hover {\\n        background-color: var(--dark-purple, #6C0287);\\n        border: 3px solid var(--dark-purple, #6C0287);\\n        border-radius: 10px;\\n        color: var(--main-text-color, #FFFFFF);\\n    }\\n\\n    &:focus {\\n        background-color: var(--dark-purple, #6C0287);\\n        border-radius: 10px;\\n        border: none;\\n        color: var(--main-text-color, #FFFFFF);\\n    }\\n\\n    &:active {\\n        background-color: var(--cold-purple, #640AA3);\\n        border: 1px solid var(--black-color, #000000);\\n        border-radius: 10px;\\n        color: var(--main-text-color, #FFFFFF);\\n    }\\n\\n    &_visible {\\n        display: block;\\n        position: absolute;\\n        top: calc(100% + 318px);\\n        left: 50%;\\n        transform: translateX(-50%);\\n        z-index: 99;\\n    }\\n}\\n\\n@keyframes slideDown {\\n    from {\\n        transform: translateY(-100%);\\n    }\\n    to {\\n        transform: translateY(0);\\n    }\\n}\\n\\n.mobile-overlay {\\n    position: fixed;\\n    top: 0;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    background-color: var(--main-background-color, #1B1A1B);\\n    opacity: 0.6;\\n    z-index: 1;\\n}\\n\\n@media screen and (max-width: 1320px) {\\n    .header {\\n        padding: 30px 60px 0 60px;\\n\\n        &.sticky {\\n            padding: 30px 60px;\\n        }\\n    }\\n\\n    .header__list {\\n        gap: 20px;\\n    }\\n\\n    .header__link-menu {\\n        font-size: 18px;\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .header {\\n        padding: 30px 40px 0 40px;\\n        position: relative;\\n\\n        &.sticky {\\n            padding: 30px 40px;\\n        }\\n    }\\n\\n    .header__logo {\\n        width: 87px;\\n        height: 55px;\\n    }\\n\\n    .header__navigation {\\n        position: absolute;\\n        top: 100%;\\n        left: 0;\\n        right: 0;\\n        display: none;\\n        color: var(--main-text-color, #FFFFFF);\\n        background-color: var(--main-background-color, #1B1A1B);\\n        padding: 45px;\\n        z-index: 1;\\n    }\\n\\n    .header__list {\\n        display: flex;\\n        flex-direction: column;\\n        align-items: center;\\n    }\\n\\n    .header__item {\\n        margin-bottom: 10px;\\n        text-transform: uppercase;\\n        font-weight: bold;\\n    }\\n\\n    .header__callback {\\n        width: 229px;\\n        height: 45px;\\n        font-size: 18px;\\n        line-height: 24px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .header {\\n        padding: 20px 20px 0 20px;\\n\\n        &.sticky {\\n            padding: 20px 20px;\\n        }\\n    }\\n\\n    .header__burger {\\n        display: block;\\n    }\\n\\n    .header__logo {\\n        width: 66px;\\n        height: 42px;\\n    }\\n\\n    .header__link-menu {\\n        font-size: 14px;\\n    }\\n\\n    .header__callback {\\n        display: none;\\n        width: 184px;\\n        height: 37px;\\n        font-size: 14px;\\n        line-height: 24px;\\n\\n        &_visible {\\n            display: block;\\n            position: absolute;\\n            top: calc(100% + 318px);\\n            left: 50%;\\n            transform: translateX(-50%);\\n            z-index: 99;\\n        }\\n    }\\n\\n    .header__navigation {\\n        padding: 45px 45px 100px 45px;\\n    }\\n}\\n\",\".footer {\\n    position: relative;\\n    overflow: hidden;\\n}\\n\\n.footer__contacts {\\n    padding: 100px 0 80px 0;\\n    position: relative;\\n    z-index: 2;\\n}\\n\\n.footer__title {\\n    text-align: center;\\n    margin-bottom: 80px;\\n    position: relative;\\n    z-index: 2;\\n    opacity: 0;\\n    animation: titleFadeIn 1s ease-out forwards;\\n\\n    &::after {\\n        content: '';\\n        position: absolute;\\n        bottom: -15px;\\n        left: 50%;\\n        transform: translateX(-50%);\\n        width: 80px;\\n        height: 3px;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        border-radius: 2px;\\n        animation: lineExpand 1s ease-out 0.5s forwards;\\n        scale: 0 1;\\n    }\\n}\\n\\n.footer__content {\\n    display: grid;\\n    grid-template-columns: 1fr 1fr;\\n    gap: 80px;\\n    align-items: start;\\n    position: relative;\\n    z-index: 2;\\n    opacity: 0;\\n    animation: contentSlideIn 1s ease-out 0.3s forwards;\\n}\\n\\n.footer__info {\\n    display: flex;\\n    flex-direction: column;\\n    gap: 50px;\\n}\\n\\n.footer__address {\\n    display: flex;\\n    flex-direction: column;\\n    gap: 30px;\\n    font-style: normal;\\n}\\n\\n.footer__detail {\\n    display: flex;\\n    align-items: flex-start;\\n    gap: 20px;\\n    transition: all 0.3s ease;\\n    padding: 20px;\\n    border-radius: 15px;\\n    background: rgba(255, 255, 255, 0.05);\\n    backdrop-filter: blur(10px);\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n\\n    &:hover {\\n        transform: translateX(10px);\\n        background: rgba(255, 255, 255, 0.08);\\n        border-color: rgba(205, 6, 255, 0.3);\\n        box-shadow: 0 10px 30px rgba(205, 6, 255, 0.2);\\n\\n        .footer__icon {\\n            background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n            color: #FFFFFF;\\n            transform: scale(1.1);\\n        }\\n    }\\n}\\n\\n.footer__icon {\\n    width: 50px;\\n    height: 50px;\\n    min-width: 50px;\\n    background: rgba(255, 255, 255, 0.1);\\n    border-radius: 50%;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    color: rgba(255, 255, 255, 0.8);\\n    transition: all 0.3s ease;\\n\\n    svg {\\n        width: 24px;\\n        height: 24px;\\n    }\\n}\\n\\n.footer__text {\\n    display: flex;\\n    flex-direction: column;\\n    gap: 5px;\\n}\\n\\n.footer__city {\\n    font-size: 18px;\\n    font-weight: 600;\\n    color: #FFFFFF;\\n}\\n\\n.footer__street {\\n    font-size: 16px;\\n    color: rgba(255, 255, 255, 0.8);\\n}\\n\\n.footer__link {\\n    font-size: 18px;\\n    font-weight: 500;\\n    color: #FFFFFF;\\n    text-decoration: none;\\n    transition: color 0.3s ease;\\n    display: flex;\\n    align-items: center;\\n    min-height: 50px;\\n\\n    &:hover {\\n        color: var(--neon-purple, #CD06FF);\\n    }\\n}\\n\\n.footer__social {\\n    display: flex;\\n    gap: 20px;\\n    flex-wrap: wrap;\\n    justify-content: center;\\n}\\n\\n.footer__social-item {\\n    opacity: 0;\\n    animation: socialItemAppear 0.6s ease-out forwards;\\n\\n    @for $i from 1 through 4 {\\n        &:nth-child(#{$i}) {\\n            animation-delay: #{0.5 + $i * 0.1}s;\\n        }\\n    }\\n}\\n\\n.footer__social-link {\\n    width: 60px;\\n    height: 60px;\\n    background: rgba(255, 255, 255, 0.1);\\n    border-radius: 50%;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    color: rgba(255, 255, 255, 0.8);\\n    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\\n    text-decoration: none;\\n    position: relative;\\n    overflow: hidden;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n        border-radius: 50%;\\n    }\\n\\n    svg {\\n        width: 28px;\\n        height: 28px;\\n        position: relative;\\n        z-index: 1;\\n        transition: transform 0.3s ease;\\n    }\\n\\n    &:hover {\\n        transform: translateY(-8px) scale(1.1);\\n        box-shadow: 0 15px 35px rgba(205, 6, 255, 0.4);\\n        color: #FFFFFF;\\n\\n        &::before {\\n            opacity: 1;\\n        }\\n\\n        svg {\\n            transform: scale(1.1);\\n        }\\n    }\\n\\n    &--vk:hover {\\n        box-shadow: 0 15px 35px rgba(70, 130, 180, 0.4);\\n\\n        &::before {\\n            background: linear-gradient(45deg, #4682B4, #5A9BD4);\\n        }\\n    }\\n\\n    &--telegram:hover {\\n        box-shadow: 0 15px 35px rgba(46, 134, 193, 0.4);\\n\\n        &::before {\\n            background: linear-gradient(45deg, #2E86C1, #3498DB);\\n        }\\n    }\\n\\n    &--pinterest:hover {\\n        box-shadow: 0 15px 35px rgba(189, 8, 28, 0.4);\\n\\n        &::before {\\n            background: linear-gradient(45deg, #BD081C, #E74C3C);\\n        }\\n    }\\n\\n    &--other:hover {\\n        box-shadow: 0 15px 35px rgba(52, 152, 219, 0.4);\\n\\n        &::before {\\n            background: linear-gradient(45deg, #3498DB, #5DADE2);\\n        }\\n    }\\n}\\n\\n.footer__map {\\n    position: relative;\\n    border-radius: 25px;\\n    overflow: hidden;\\n    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);\\n    background: rgba(255, 255, 255, 0.05);\\n    backdrop-filter: blur(10px);\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n    height: 400px;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n        z-index: 2;\\n        pointer-events: none;\\n    }\\n\\n    &:hover::before {\\n        opacity: 1;\\n    }\\n}\\n\\n.footer__iframe {\\n    width: 100%;\\n    height: 100%;\\n    border: none;\\n    border-radius: 25px;\\n    filter: grayscale(1) contrast(1.2) brightness(0.8);\\n    transition: filter 0.3s ease;\\n\\n    &:hover {\\n        filter: grayscale(0) contrast(1) brightness(1);\\n    }\\n}\\n\\n.footer__copyright {\\n    background: rgba(0, 0, 0, 0.3);\\n    backdrop-filter: blur(20px);\\n    border-top: 1px solid rgba(255, 255, 255, 0.1);\\n    padding: 30px 0;\\n    position: relative;\\n    z-index: 2;\\n}\\n\\n.footer__copyright-content {\\n    display: flex;\\n    justify-content: space-between;\\n    align-items: center;\\n    flex-wrap: wrap;\\n    gap: 20px;\\n}\\n\\n.footer__copyright-text {\\n    font-size: 14px;\\n    color: rgba(255, 255, 255, 0.7);\\n    margin: 0;\\n}\\n\\n.footer__designer-link {\\n    color: var(--neon-purple, #CD06FF);\\n    text-decoration: none;\\n    transition: all 0.3s ease;\\n    position: relative;\\n\\n    &::after {\\n        content: '';\\n        position: absolute;\\n        bottom: -2px;\\n        left: 0;\\n        width: 0;\\n        height: 1px;\\n        background: var(--neon-purple, #CD06FF);\\n        transition: width 0.3s ease;\\n    }\\n\\n    &:hover {\\n        color: #FFFFFF;\\n        text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\\n\\n        &::after {\\n            width: 100%;\\n        }\\n    }\\n}\\n\\n@keyframes dotsMove {\\n    0% { transform: translate(0, 0); }\\n    100% { transform: translate(60px, 60px); }\\n}\\n\\n@keyframes titleFadeIn {\\n    from {\\n        opacity: 0;\\n        transform: translateY(-30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes lineExpand {\\n    from { scale: 0 1; }\\n    to { scale: 1 1; }\\n}\\n\\n@keyframes contentSlideIn {\\n    from {\\n        opacity: 0;\\n        transform: translateY(50px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes socialItemAppear {\\n    from {\\n        opacity: 0;\\n        transform: translateY(20px) scale(0.8);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0) scale(1);\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .footer__contacts {\\n        padding: 70px 0 60px 0;\\n    }\\n\\n    .footer__title {\\n        margin-bottom: 60px;\\n    }\\n\\n    .footer__content {\\n        grid-template-columns: 1fr;\\n        gap: 60px;\\n    }\\n\\n    .footer__map {\\n        height: 300px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .footer__contacts {\\n        padding: 50px 0 40px 0;\\n    }\\n\\n    .footer__title {\\n        margin-bottom: 40px;\\n    }\\n\\n    .footer__content {\\n        gap: 40px;\\n    }\\n\\n    .footer__info {\\n        gap: 30px;\\n    }\\n\\n    .footer__address {\\n        gap: 20px;\\n    }\\n\\n    .footer__detail {\\n        padding: 15px;\\n        gap: 15px;\\n    }\\n\\n    .footer__icon {\\n        width: 40px;\\n        height: 40px;\\n        min-width: 40px;\\n\\n        svg {\\n            width: 20px;\\n            height: 20px;\\n        }\\n    }\\n\\n    .footer__city {\\n        font-size: 16px;\\n    }\\n\\n    .footer__street,\\n    .footer__link {\\n        font-size: 14px;\\n    }\\n\\n    .footer__social {\\n        gap: 15px;\\n    }\\n\\n    .footer__social-link {\\n        width: 50px;\\n        height: 50px;\\n\\n        svg {\\n            width: 24px;\\n            height: 24px;\\n        }\\n    }\\n\\n    .footer__map {\\n        height: 250px;\\n        border-radius: 20px;\\n    }\\n\\n    .footer__copyright {\\n        padding: 20px 0;\\n    }\\n\\n    .footer__copyright-content {\\n        flex-direction: column;\\n        text-align: center;\\n        gap: 10px;\\n    }\\n\\n    .footer__copyright-text {\\n        font-size: 12px;\\n    }\\n}\\n\",\".about-us {\\n    padding: 100px 0;\\n    position: relative;\\n    overflow: hidden;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        opacity: 0.5;\\n        animation: patternMove 10s linear infinite;\\n    }\\n}\\n\\n.about-us__content {\\n    display: grid;\\n    grid-template-columns: 1fr 400px;\\n    grid-template-rows: auto auto;\\n    gap: 60px 80px;\\n    align-items: start;\\n    position: relative;\\n    z-index: 2;\\n}\\n\\n.about-us__gallery {\\n    grid-column: 1 / 2;\\n    grid-row: 1 / 3;\\n    display: grid;\\n    grid-template-columns: repeat(13, 1fr);\\n    grid-template-rows: repeat(3, auto);\\n    gap: 10px;\\n    opacity: 0;\\n    animation: galleryAppear 1s ease-out 0.3s forwards;\\n}\\n\\n.about-us__gallery-item {\\n    position: relative;\\n    border-radius: 15px;\\n    overflow: hidden;\\n    cursor: pointer;\\n    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(135deg, rgba(205, 6, 255, 0.2) 0%, rgba(255, 6, 205, 0.2) 100%);\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n        z-index: 2;\\n    }\\n\\n    &::after {\\n        content: '';\\n        position: absolute;\\n        top: 50%;\\n        left: 50%;\\n        transform: translate(-50%, -50%);\\n        width: 50px;\\n        height: 50px;\\n        background: rgba(255, 255, 255, 0.9);\\n        border-radius: 50%;\\n        display: flex;\\n        align-items: center;\\n        justify-content: center;\\n        opacity: 0;\\n        transition: all 0.3s ease;\\n        z-index: 3;\\n        font-size: 20px;\\n        color: #1b1a1b;\\n    }\\n\\n    &:hover {\\n        transform: translateY(-10px) scale(1.05);\\n        box-shadow: 0 20px 40px rgba(205, 6, 255, 0.4);\\n\\n        &::before {\\n            opacity: 1;\\n        }\\n\\n        &::after {\\n            opacity: 1;\\n            content: '🎮';\\n        }\\n\\n        .about-us__image {\\n            transform: scale(1.1);\\n            filter: brightness(1.2);\\n        }\\n    }\\n\\n    @for $i from 1 through 7 {\\n        &:nth-child(#{$i}) {\\n            animation: itemFloat 1s ease-out #{$i * 0.1}s forwards;\\n            transform: translateY(50px);\\n        }\\n    }\\n\\n    &--vr {\\n        grid-row: 1 / 2;\\n        grid-column: 1 / 7;\\n    }\\n\\n    &--games {\\n        grid-row: 1 / 2;\\n        grid-column: 7 / 13;\\n    }\\n\\n    &--fifa {\\n        grid-row: 2 / 3;\\n        grid-column: 1 / 4;\\n    }\\n\\n    &--pad {\\n        grid-row: 2 / 3;\\n        grid-column: 4 / 8;\\n    }\\n\\n    &--controller {\\n        grid-row: 2 / 3;\\n        grid-column: 8 / 13;\\n    }\\n\\n    &--karaoke {\\n        grid-row: 3 / 4;\\n        grid-column: 1 / 9;\\n    }\\n\\n    &--vr2 {\\n        grid-row: 3 / 4;\\n        grid-column: 9 / 13;\\n    }\\n}\\n\\n.about-us__image {\\n    width: 100%;\\n    height: 100%;\\n    object-fit: cover;\\n    transition: all 0.5s ease;\\n}\\n\\n.about-us__text {\\n    grid-column: 2 / 3;\\n    grid-row: 1 / 2;\\n    background: rgba(255, 255, 255, 0.05);\\n    backdrop-filter: blur(10px);\\n    border-radius: 20px;\\n    padding: 40px;\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n    opacity: 0;\\n    animation: textSlideIn 1s ease-out 0.6s forwards;\\n}\\n\\n.about-us__description {\\n    font-size: 18px;\\n    line-height: 28px;\\n    margin: 0 0 20px 0;\\n    color: rgba(255, 255, 255, 0.9);\\n    transition: color 0.3s ease;\\n\\n    &:last-child {\\n        margin: 0;\\n    }\\n\\n    &:hover {\\n        color: #FFFFFF;\\n    }\\n}\\n\\n.about-us__quote {\\n    grid-column: 2 / 3;\\n    grid-row: 2 / 3;\\n    background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\\n    backdrop-filter: blur(15px);\\n    border-radius: 25px;\\n    padding: 40px;\\n    border: 2px solid rgba(205, 6, 255, 0.2);\\n    position: relative;\\n    opacity: 0;\\n    animation: quoteAppear 1s ease-out 0.9s forwards;\\n\\n    &::before {\\n        content: '\\\"';\\n        position: absolute;\\n        top: -20px;\\n        left: 30px;\\n        font-size: 80px;\\n        color: rgba(205, 6, 255, 0.3);\\n        font-family: serif;\\n        line-height: 1;\\n    }\\n}\\n\\n.about-us__quote-text {\\n    font-size: 20px;\\n    line-height: 30px;\\n    margin: 0 0 30px 0;\\n    font-style: italic;\\n    color: #FFFFFF;\\n}\\n\\n.about-us__quote-highlight {\\n    color: var(--neon-purple, #CD06FF);\\n    font-weight: 700;\\n    text-transform: uppercase;\\n    text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\\n}\\n\\n.about-us__cite {\\n    display: flex;\\n    align-items: center;\\n    gap: 15px;\\n    font-style: normal;\\n}\\n\\n.about-us__author-photo {\\n    width: 60px;\\n    height: 60px;\\n    border-radius: 50%;\\n    object-fit: cover;\\n    border: 3px solid var(--neon-purple, #CD06FF);\\n    box-shadow: 0 0 20px rgba(205, 6, 255, 0.3);\\n}\\n\\n.about-us__author {\\n    font-size: 16px;\\n    color: rgba(255, 255, 255, 0.8);\\n    line-height: 22px;\\n}\\n\\n@keyframes patternMove {\\n    0% { transform: translateX(0); }\\n    100% { transform: translateX(4px); }\\n}\\n\\n@keyframes titleAppear {\\n    from {\\n        opacity: 0;\\n        transform: translateY(-30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes lineExpand {\\n    from { scale: 0 1; }\\n    to { scale: 1 1; }\\n}\\n\\n@keyframes galleryAppear {\\n    from {\\n        opacity: 0;\\n        transform: translateX(-50px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateX(0);\\n    }\\n}\\n\\n@keyframes itemFloat {\\n    from {\\n        transform: translateY(50px);\\n        opacity: 0;\\n    }\\n    to {\\n        transform: translateY(0);\\n        opacity: 1;\\n    }\\n}\\n\\n@keyframes textSlideIn {\\n    from {\\n        opacity: 0;\\n        transform: translateX(50px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateX(0);\\n    }\\n}\\n\\n@keyframes quoteAppear {\\n    from {\\n        opacity: 0;\\n        transform: translateY(30px) scale(0.95);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0) scale(1);\\n    }\\n}\\n\\n@media screen and (max-width: 1320px) {\\n    .about-us {\\n        padding: 70px 0;\\n    }\\n\\n    .about-us__content {\\n        grid-template-columns: 1fr 350px;\\n        gap: 40px 60px;\\n    }\\n\\n    .about-us__text {\\n        padding: 30px;\\n    }\\n\\n    .about-us__description {\\n        font-size: 16px;\\n        line-height: 24px;\\n    }\\n\\n    .about-us__quote {\\n        padding: 30px;\\n    }\\n\\n    .about-us__quote-text {\\n        font-size: 18px;\\n        line-height: 26px;\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .about-us {\\n        padding: 50px 0;\\n    }\\n\\n    .about-us__content {\\n        grid-template-columns: 400px 1fr;\\n        grid-template-rows: auto auto auto;\\n        gap: 30px;\\n    }\\n\\n    .about-us__gallery {\\n        grid-column: 1 / 2;\\n        grid-row: 1 / 4;\\n    }\\n\\n    .about-us__text {\\n        grid-column: 2 / 3;\\n        grid-row: 1 / 2;\\n        padding: 25px;\\n    }\\n\\n    .about-us__quote {\\n        grid-column: 2 / 3;\\n        grid-row: 2 / 3;\\n        padding: 25px;\\n    }\\n\\n    .about-us__description {\\n        font-size: 14px;\\n        line-height: 20px;\\n    }\\n\\n    .about-us__quote-text {\\n        font-size: 16px;\\n        line-height: 22px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .about-us {\\n        padding: 30px 0;\\n    }\\n\\n    .about-us__title {\\n        margin-bottom: 40px;\\n    }\\n\\n    .about-us__content {\\n        grid-template-columns: 1fr;\\n        grid-template-rows: auto auto auto;\\n        gap: 30px;\\n    }\\n\\n    .about-us__gallery {\\n        grid-column: 1 / 2;\\n        grid-row: 2 / 3;\\n        max-width: 280px;\\n        justify-self: center;\\n    }\\n\\n    .about-us__text {\\n        grid-column: 1 / 2;\\n        grid-row: 1 / 2;\\n        padding: 20px;\\n    }\\n\\n    .about-us__quote {\\n        grid-column: 1 / 2;\\n        grid-row: 3 / 4;\\n        padding: 20px;\\n\\n        &::before {\\n            font-size: 60px;\\n            top: -15px;\\n            left: 20px;\\n        }\\n    }\\n\\n    .about-us__description {\\n        font-size: 12px;\\n        line-height: 16px;\\n        margin: 0 0 15px 0;\\n    }\\n\\n    .about-us__quote-text {\\n        font-size: 14px;\\n        line-height: 18px;\\n        margin: 0 0 20px 0;\\n    }\\n\\n    .about-us__author-photo {\\n        width: 50px;\\n        height: 50px;\\n    }\\n\\n    .about-us__author {\\n        font-size: 14px;\\n        line-height: 18px;\\n    }\\n}\\n\",\".booking {\\n    padding: 80px 0;\\n}\\n\\n.booking__form {\\n    max-width: 1200px;\\n    margin: 0 auto;\\n}\\n\\n.booking__fieldset {\\n    border: none;\\n    margin: 0 0 40px 0;\\n    padding: 0;\\n\\n    &--halls {\\n        margin-bottom: 60px;\\n    }\\n}\\n\\n.booking__legend {\\n    font-size: 32px;\\n    font-weight: 600;\\n    color: #FFFFFF;\\n    margin-bottom: 30px;\\n    text-align: center;\\n    width: 100%;\\n}\\n\\n.booking__halls {\\n    display: grid;\\n    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\\n    gap: 20px;\\n    margin-bottom: 40px;\\n}\\n\\n.booking__hall-label {\\n    position: relative;\\n    cursor: pointer;\\n    display: block;\\n    height: 200px;\\n    border-radius: 15px;\\n    overflow: hidden;\\n    transition: all 0.3s ease;\\n\\n    &:hover {\\n        transform: translateY(-5px);\\n        box-shadow: 0 15px 40px rgba(205, 6, 255, 0.3);\\n    }\\n}\\n\\n.booking__hall-input {\\n    position: absolute;\\n    opacity: 0;\\n    pointer-events: none;\\n\\n    &:checked + .booking__hall-visual {\\n        border: 3px solid #CD06FF;\\n        box-shadow: 0 0 30px rgba(205, 6, 255, 0.6);\\n        transform: scale(1.02);\\n\\n        &::after {\\n            opacity: 1;\\n        }\\n    }\\n\\n    &--80s-vibes + .booking__hall-visual {\\n        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('../img/rooms/80s-vibes.jpg');\\n        background-size: cover;\\n        background-position: center;\\n    }\\n\\n    &--star-wars + .booking__hall-visual {\\n        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('../img/rooms/star-wars.jpg');\\n        background-size: cover;\\n        background-position: center;\\n    }\\n\\n    &--wild-west + .booking__hall-visual {\\n        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('../img/rooms/wild-west.jpg');\\n        background-size: cover;\\n        background-position: center;\\n    }\\n\\n    &--neon-style + .booking__hall-visual {\\n        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('../img/rooms/neon-style.jpg');\\n        background-size: cover;\\n        background-position: center;\\n    }\\n}\\n\\n.booking__hall-visual {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    height: 100%;\\n    border: 2px solid transparent;\\n    border-radius: 15px;\\n    font-size: 24px;\\n    font-weight: 700;\\n    color: #FFFFFF;\\n    text-transform: uppercase;\\n    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);\\n    transition: all 0.3s ease;\\n    position: relative;\\n\\n    &::after {\\n        content: '✓';\\n        position: absolute;\\n        top: 15px;\\n        right: 15px;\\n        width: 30px;\\n        height: 30px;\\n        background: #CD06FF;\\n        border-radius: 50%;\\n        display: flex;\\n        align-items: center;\\n        justify-content: center;\\n        font-size: 18px;\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n    }\\n}\\n\\n.booking__content {\\n    background: rgba(255, 255, 255, 0.05);\\n    border-radius: 20px;\\n    padding: 40px;\\n    backdrop-filter: blur(10px);\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n}\\n\\n.booking__sub-fieldset {\\n    border: none;\\n    margin: 0 0 30px 0;\\n    padding: 0;\\n}\\n\\n.booking__sub-legend {\\n    font-size: 20px;\\n    font-weight: 500;\\n    color: #FFFFFF;\\n    margin-bottom: 15px;\\n}\\n\\n.booking__options {\\n    display: flex;\\n    flex-wrap: wrap;\\n    gap: 15px;\\n}\\n\\n.booking__option-label {\\n    position: relative;\\n    cursor: pointer;\\n}\\n\\n.booking__option-input {\\n    position: absolute;\\n    opacity: 0;\\n    pointer-events: none;\\n\\n    &:checked + .booking__option-text {\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        color: #FFFFFF;\\n        transform: scale(1.05);\\n        box-shadow: 0 5px 15px rgba(205, 6, 255, 0.4);\\n    }\\n}\\n\\n.booking__option-text {\\n    display: block;\\n    padding: 12px 20px;\\n    background: rgba(255, 255, 255, 0.1);\\n    border: 1px solid rgba(255, 255, 255, 0.2);\\n    border-radius: 25px;\\n    color: #FFFFFF;\\n    font-size: 16px;\\n    transition: all 0.3s ease;\\n\\n    &:hover {\\n        background: rgba(255, 255, 255, 0.15);\\n        transform: translateY(-2px);\\n    }\\n}\\n\\n.booking__fieldset--datetime {\\n    margin-top: 40px;\\n}\\n\\n.booking__datetime {\\n    display: grid;\\n    grid-template-columns: 1fr 1fr;\\n    gap: 40px;\\n}\\n\\n.booking__selects,\\n.booking__inputs {\\n    display: flex;\\n    flex-direction: column;\\n    gap: 20px;\\n}\\n\\n.booking__select-label,\\n.booking__input-label {\\n    display: flex;\\n    flex-direction: column;\\n    gap: 8px;\\n}\\n\\n.booking__input-text {\\n    font-size: 16px;\\n    color: #FFFFFF;\\n    font-weight: 500;\\n}\\n\\n.booking__select,\\n.booking__input {\\n    padding: 15px 20px;\\n    background: rgba(255, 255, 255, 0.1);\\n    border: 1px solid rgba(255, 255, 255, 0.2);\\n    border-radius: 10px;\\n    color: #FFFFFF;\\n    font-size: 16px;\\n    transition: all 0.3s ease;\\n\\n    &:focus {\\n        outline: none;\\n        border-color: #CD06FF;\\n        box-shadow: 0 0 15px rgba(205, 6, 255, 0.3);\\n        background: rgba(255, 255, 255, 0.15);\\n    }\\n\\n    &::placeholder {\\n        color: rgba(255, 255, 255, 0.6);\\n    }\\n}\\n\\n.booking__select {\\n    cursor: pointer;\\n\\n    option {\\n        background: #1b1a1b;\\n        color: #FFFFFF;\\n    }\\n}\\n\\n.booking__submit {\\n    width: 100%;\\n    max-width: 400px;\\n    margin: 40px auto 0;\\n    display: block;\\n    padding: 18px 40px;\\n    background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n    border: none;\\n    border-radius: 50px;\\n    color: #FFFFFF;\\n    font-size: 20px;\\n    font-weight: 700;\\n    text-transform: uppercase;\\n    cursor: pointer;\\n    transition: all 0.3s ease;\\n    position: relative;\\n    overflow: hidden;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: -100%;\\n        width: 100%;\\n        height: 100%;\\n        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);\\n        transition: left 0.5s ease;\\n    }\\n\\n    &:hover {\\n        transform: translateY(-3px);\\n        box-shadow: 0 15px 40px rgba(205, 6, 255, 0.4);\\n\\n        &::before {\\n            left: 100%;\\n        }\\n    }\\n\\n    &:active {\\n        transform: translateY(-1px);\\n    }\\n}\\n\\n.booking__message {\\n    padding: 15px 20px;\\n    margin-bottom: 20px;\\n    border-radius: 5px;\\n\\n    &--success {\\n        background-color: #4caf50;\\n        color: white;\\n    }\\n\\n    &--error {\\n        background-color: #f44336;\\n        color: white;\\n    }\\n}\\n\\n@keyframes glow {\\n    from {\\n        text-shadow: 0 0 20px rgba(205, 6, 255, 0.5);\\n    }\\n    to {\\n        text-shadow: 0 0 30px rgba(205, 6, 255, 0.8), 0 0 40px rgba(255, 6, 205, 0.3);\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .booking {\\n        padding: 60px 0;\\n    }\\n\\n    .booking__title {\\n        font-size: 36px;\\n        margin-bottom: 40px;\\n    }\\n\\n    .booking__content {\\n        padding: 30px;\\n    }\\n\\n    .booking__datetime {\\n        grid-template-columns: 1fr;\\n        gap: 30px;\\n    }\\n\\n    .booking__halls {\\n        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\\n    }\\n\\n    .booking__hall-visual {\\n        font-size: 20px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .booking {\\n        padding: 40px 0;\\n    }\\n\\n    .booking__title {\\n        font-size: 28px;\\n        margin-bottom: 30px;\\n    }\\n\\n    .booking__legend {\\n        font-size: 24px;\\n        margin-bottom: 20px;\\n    }\\n\\n    .booking__content {\\n        padding: 20px;\\n    }\\n\\n    .booking__halls {\\n        grid-template-columns: 1fr;\\n        gap: 15px;\\n    }\\n\\n    .booking__hall-label {\\n        height: 150px;\\n    }\\n\\n    .booking__hall-visual {\\n        font-size: 18px;\\n    }\\n\\n    .booking__options {\\n        gap: 10px;\\n    }\\n\\n    .booking__option-text {\\n        padding: 10px 16px;\\n        font-size: 14px;\\n    }\\n\\n    .booking__select,\\n    .booking__input {\\n        padding: 12px 16px;\\n        font-size: 14px;\\n    }\\n\\n    .booking__submit {\\n        font-size: 18px;\\n        padding: 15px 30px;\\n    }\\n}\\n\",\".entertainment {\\n    padding: 80px 0;\\n    position: relative;\\n}\\n\\n.entertainment__list {\\n    display: flex;\\n    flex-wrap: wrap;\\n    justify-content: center;\\n    gap: 40px 20px;\\n    align-items: flex-end;\\n    margin: 0 0 70px 0;\\n    position: relative;\\n    z-index: 2;\\n}\\n\\n.entertainment__item {\\n    display: flex;\\n    position: relative;\\n    width: 380px;\\n    height: 228px;\\n    flex-basis: 380px;\\n    border-radius: 20px;\\n    overflow: hidden;\\n    cursor: pointer;\\n    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);\\n    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);\\n    backdrop-filter: blur(10px);\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n    opacity: 0;\\n    transform: translateY(50px);\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(108, 2, 135, 0.1) 100%);\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n        z-index: 1;\\n    }\\n\\n    &::after {\\n        content: '';\\n        position: absolute;\\n        top: -50%;\\n        left: -50%;\\n        width: 200%;\\n        height: 200%;\\n        background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);\\n        transform: rotate(45deg);\\n        opacity: 0;\\n        transition: all 0.6s ease;\\n        z-index: 3;\\n    }\\n\\n    &:hover {\\n        transform: translateY(-15px) scale(1.05);\\n        box-shadow:\\n            0 25px 50px rgba(205, 6, 255, 0.2),\\n            0 15px 30px rgba(108, 2, 135, 0.3),\\n            inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        border-color: rgba(205, 6, 255, 0.3);\\n\\n        &::before {\\n            opacity: 1;\\n        }\\n\\n        &::after {\\n            top: -100%;\\n            left: -100%;\\n            opacity: 1;\\n        }\\n\\n        .entertainment__image {\\n            transform: scale(1.1);\\n            filter: brightness(1.2) saturate(1.3);\\n        }\\n\\n        .entertainment__description {\\n            text-shadow: 0 0 20px rgba(205, 6, 255, 0.8);\\n            color: var(--neon-purple, #CD06FF);\\n        }\\n    }\\n\\n    @for $i from 1 through 6 {\\n        &:nth-child(#{$i}) {\\n            animation: slideInUp 0.8s ease-out #{$i * 0.1}s forwards;\\n        }\\n    }\\n\\n    &--vr {\\n        &:hover {\\n            box-shadow:\\n                0 25px 50px rgba(0, 255, 255, 0.2),\\n                0 15px 30px rgba(0, 200, 255, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        }\\n    }\\n\\n    &--audio {\\n        &:hover {\\n            box-shadow:\\n                0 25px 50px rgba(255, 106, 0, 0.2),\\n                0 15px 30px rgba(255, 140, 0, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        }\\n    }\\n\\n    &--karaoke {\\n        &:hover {\\n            box-shadow:\\n                0 25px 50px rgba(255, 20, 147, 0.2),\\n                0 15px 30px rgba(255, 69, 179, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        }\\n    }\\n\\n    &--games {\\n        &:hover {\\n            box-shadow:\\n                0 25px 50px rgba(50, 205, 50, 0.2),\\n                0 15px 30px rgba(0, 255, 127, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        }\\n    }\\n\\n    &--movies {\\n        &:hover {\\n            box-shadow:\\n                0 25px 50px rgba(255, 215, 0, 0.2),\\n                0 15px 30px rgba(255, 193, 7, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        }\\n    }\\n\\n    &--ps {\\n        &:hover {\\n            box-shadow:\\n                0 25px 50px rgba(0, 123, 255, 0.2),\\n                0 15px 30px rgba(52, 144, 255, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n        }\\n    }\\n}\\n\\n.entertainment__image {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: 100%;\\n    height: 100%;\\n    object-fit: cover;\\n    transition: all 0.5s ease;\\n    z-index: 1;\\n}\\n\\n.entertainment__description {\\n    position: absolute;\\n    bottom: 0;\\n    left: 0;\\n    right: 0;\\n    padding: 20px 30px 30px;\\n    white-space: pre-line;\\n    font-weight: 700;\\n    font-size: 20px;\\n    line-height: 28px;\\n    color: var(--main-text-color, #FFFFFF);\\n    margin: 0;\\n    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%);\\n    transition: all 0.3s ease;\\n    z-index: 2;\\n    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);\\n}\\n\\n@keyframes slideInDown {\\n    from {\\n        opacity: 0;\\n        transform: translateY(-30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes slideInUp {\\n    from {\\n        opacity: 0;\\n        transform: translateY(50px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@media screen and (max-width: 1320px) {\\n    .entertainment {\\n        padding: 60px 0;\\n    }\\n\\n    .entertainment__item {\\n        flex-basis: 287px;\\n        width: 287px;\\n        height: 172px;\\n    }\\n\\n    .entertainment__description {\\n        padding: 15px 20px 20px;\\n        font-size: 18px;\\n        line-height: 24px;\\n    }\\n\\n    .entertainment__list {\\n        gap: 30px 20px;\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .entertainment {\\n        padding: 50px 0;\\n    }\\n\\n    .entertainment__item {\\n        flex-basis: 334px;\\n        width: 334px;\\n        height: 200px;\\n\\n        &--audio {\\n            margin: unset;\\n        }\\n\\n        &--movies {\\n            margin: unset;\\n        }\\n\\n        &:hover {\\n            transform: translateY(-10px) scale(1.03);\\n        }\\n    }\\n\\n    .entertainment__list {\\n        gap: 20px;\\n        margin: 0 0 50px 0;\\n    }\\n\\n    .entertainment__description {\\n        font-size: 16px;\\n        line-height: 22px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .entertainment {\\n        padding: 40px 0;\\n    }\\n\\n    .entertainment__item {\\n        flex-basis: 135px;\\n        width: 135px;\\n        height: 75px;\\n        border-radius: 15px;\\n\\n        &--movies {\\n            width: 130px;\\n            white-space: normal;\\n        }\\n\\n        &:hover {\\n            transform: translateY(-5px) scale(1.02);\\n            box-shadow:\\n                0 10px 20px rgba(205, 6, 255, 0.3),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.1);\\n        }\\n    }\\n\\n    .entertainment__description {\\n        padding: 5px 10px 8px;\\n        font-size: 10px;\\n        line-height: 14px;\\n        white-space: normal;\\n    }\\n\\n    .entertainment__title {\\n        margin-bottom: 30px;\\n    }\\n}\\n\",\".faq {\\n    padding: 100px 0;\\n    position: relative;\\n    overflow: hidden;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        opacity: 0.5;\\n        animation: verticalMove 12s linear infinite;\\n    }\\n}\\n\\n.faq__list {\\n    max-width: 800px;\\n    margin: 0 auto;\\n    display: flex;\\n    flex-direction: column;\\n    gap: 20px;\\n    position: relative;\\n    z-index: 2;\\n}\\n\\n.faq__item {\\n    background: rgba(255, 255, 255, 0.05);\\n    backdrop-filter: blur(15px);\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n    border-radius: 20px;\\n    overflow: hidden;\\n    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\\n    opacity: 0;\\n    transform: translateY(30px);\\n\\n    @for $i from 1 through 10 {\\n        &:nth-child(#{$i}) {\\n            animation: itemAppear 0.6s ease-out #{$i * 0.1}s forwards;\\n        }\\n    }\\n\\n    &:hover {\\n        transform: translateY(-5px);\\n        box-shadow: 0 15px 35px rgba(205, 6, 255, 0.2);\\n        border-color: rgba(205, 6, 255, 0.3);\\n    }\\n\\n    &--active {\\n        .faq__button {\\n            background: linear-gradient(135deg, rgba(205, 6, 255, 0.2) 0%, rgba(255, 6, 205, 0.2) 100%);\\n            color: #FFFFFF;\\n        }\\n\\n        .faq__icon {\\n            background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n            color: #FFFFFF;\\n            transform: rotate(45deg);\\n        }\\n\\n        .faq__path--vertical {\\n            opacity: 0;\\n        }\\n\\n        .faq__content {\\n            max-height: 200px;\\n            padding: 30px;\\n            opacity: 1;\\n        }\\n    }\\n}\\n\\n.faq__button {\\n    width: 100%;\\n    background: transparent;\\n    border: none;\\n    padding: 25px 30px;\\n    display: flex;\\n    align-items: center;\\n    justify-content: space-between;\\n    gap: 20px;\\n    cursor: pointer;\\n    transition: all 0.3s ease;\\n    text-align: left;\\n    position: relative;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(135deg, rgba(205, 6, 255, 0.1) 0%, rgba(255, 6, 205, 0.1) 100%);\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n    }\\n\\n    &:hover {\\n        &::before {\\n            opacity: 1;\\n        }\\n\\n        .faq__question {\\n            color: var(--neon-purple, #CD06FF);\\n        }\\n\\n        .faq__icon {\\n            transform: scale(1.1);\\n            background: rgba(205, 6, 255, 0.2);\\n        }\\n    }\\n}\\n\\n.faq__question {\\n    font-size: 20px;\\n    font-weight: 600;\\n    color: #FFFFFF;\\n    transition: color 0.3s ease;\\n    position: relative;\\n    z-index: 1;\\n}\\n\\n.faq__icon {\\n    width: 50px;\\n    height: 50px;\\n    border-radius: 50%;\\n    background: rgba(255, 255, 255, 0.1);\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    transition: all 0.4s ease;\\n    flex-shrink: 0;\\n    position: relative;\\n    z-index: 1;\\n}\\n\\n.faq__svg {\\n    width: 24px;\\n    height: 24px;\\n    color: rgba(255, 255, 255, 0.8);\\n    transition: all 0.4s ease;\\n}\\n\\n.faq__path {\\n    transition: all 0.4s ease;\\n    stroke-width: 2;\\n    stroke: currentColor;\\n    fill: none;\\n}\\n\\n.faq__item--active {\\n    .faq__icon {\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        color: #FFFFFF;\\n        transform: rotate(180deg);\\n    }\\n\\n    .faq__svg {\\n        color: #FFFFFF;\\n    }\\n}\\n\\n.faq__svg {\\n    width: 24px;\\n    height: 24px;\\n    color: rgba(255, 255, 255, 0.8);\\n    transition: color 0.3s ease;\\n}\\n\\n.faq__path {\\n    transition: all 0.3s ease;\\n    stroke-width: 2;\\n    stroke: currentColor;\\n    fill: none;\\n\\n    &--vertical {\\n        opacity: 1;\\n    }\\n\\n    &--horizontal {\\n        opacity: 1;\\n    }\\n}\\n\\n.faq__content {\\n    max-height: 0;\\n    overflow: hidden;\\n    opacity: 0;\\n    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\\n    background: rgba(0, 0, 0, 0.2);\\n}\\n\\n.faq__answer {\\n    font-size: 16px;\\n    line-height: 24px;\\n    color: rgba(255, 255, 255, 0.9);\\n    margin: 0;\\n    position: relative;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        left: 0;\\n        top: 0;\\n        width: 4px;\\n        height: 100%;\\n        background: linear-gradient(to bottom, #CD06FF, #FF06CD);\\n        border-radius: 2px;\\n        margin-right: 15px;\\n    }\\n\\n    padding-left: 20px;\\n}\\n\\n@keyframes verticalMove {\\n    0% { transform: translateY(0); }\\n    100% { transform: translateY(52px); }\\n}\\n\\n@keyframes titleSlideIn {\\n    from {\\n        opacity: 0;\\n        transform: translateY(-30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes lineExpand {\\n    from { scale: 0 1; }\\n    to { scale: 1 1; }\\n}\\n\\n@keyframes itemAppear {\\n    from {\\n        opacity: 0;\\n        transform: translateY(30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .faq {\\n        padding: 70px 0;\\n    }\\n\\n    .faq__title {\\n        margin-bottom: 60px;\\n    }\\n\\n    .faq__button {\\n        padding: 20px 25px;\\n    }\\n\\n    .faq__question {\\n        font-size: 18px;\\n    }\\n\\n    .faq__icon {\\n        width: 45px;\\n        height: 45px;\\n    }\\n\\n    .faq__svg {\\n        width: 20px;\\n        height: 20px;\\n    }\\n\\n    .faq__answer {\\n        font-size: 15px;\\n        line-height: 22px;\\n    }\\n\\n    .faq__item--active {\\n        .faq__content {\\n            padding: 25px;\\n        }\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .faq {\\n        padding: 50px 0;\\n    }\\n\\n    .faq__title {\\n        margin-bottom: 40px;\\n    }\\n\\n    .faq__list {\\n        gap: 15px;\\n    }\\n\\n    .faq__button {\\n        padding: 18px 20px;\\n        gap: 15px;\\n    }\\n\\n    .faq__question {\\n        font-size: 16px;\\n    }\\n\\n    .faq__icon {\\n        width: 40px;\\n        height: 40px;\\n    }\\n\\n    .faq__svg {\\n        width: 18px;\\n        height: 18px;\\n    }\\n\\n    .faq__answer {\\n        font-size: 14px;\\n        line-height: 20px;\\n        padding-left: 15px;\\n\\n        &::before {\\n            width: 3px;\\n        }\\n    }\\n\\n    .faq__item--active {\\n        .faq__content {\\n            padding: 0 20px 20px;\\n        }\\n    }\\n}\\n\",\".feedbacks {\\n    padding: 100px 0;\\n    position: relative;\\n    overflow: hidden;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        opacity: 0.5;\\n        animation: linesMove 15s linear infinite;\\n    }\\n}\\n\\n.feedbacks__slider {\\n    position: relative;\\n    max-width: 800px;\\n    margin: 0 auto;\\n    z-index: 2;\\n}\\n\\n.feedbacks__wrapper {\\n    overflow: hidden;\\n    border-radius: 25px;\\n    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);\\n    position: relative;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);\\n        border-radius: 25px;\\n        z-index: 1;\\n        pointer-events: none;\\n    }\\n}\\n\\n.feedbacks__track {\\n    display: flex;\\n    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);\\n}\\n\\n.feedbacks__slide {\\n    min-width: 100%;\\n    opacity: 0;\\n    animation: slideAppear 1s ease-out 0.8s forwards;\\n}\\n\\n.feedbacks__item {\\n    height: 100%;\\n    background: rgba(255, 255, 255, 0.05);\\n    backdrop-filter: blur(20px);\\n    border: 1px solid rgba(255, 255, 255, 0.1);\\n    border-radius: 25px;\\n    padding: 50px;\\n    text-align: center;\\n    position: relative;\\n    z-index: 2;\\n\\n    &::before {\\n        content: '\\\"';\\n        position: absolute;\\n        top: -20px;\\n        left: 50%;\\n        transform: translateX(-50%);\\n        font-size: 120px;\\n        color: rgba(205, 6, 255, 0.2);\\n        font-family: serif;\\n        line-height: 1;\\n        z-index: -1;\\n    }\\n}\\n\\n.feedbacks__photo {\\n    margin: 0 0 30px 0;\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    gap: 20px;\\n}\\n\\n.feedbacks__image {\\n    width: 100px;\\n    height: 100px;\\n    border-radius: 50%;\\n    object-fit: cover;\\n    border: 4px solid transparent;\\n    background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n    background-clip: padding-box;\\n    box-shadow:\\n        0 0 30px rgba(205, 6, 255, 0.4),\\n        inset 0 0 0 4px rgba(255, 255, 255, 0.1);\\n    transition: all 0.3s ease;\\n    position: relative;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: -8px;\\n        left: -8px;\\n        right: -8px;\\n        bottom: -8px;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        border-radius: 50%;\\n        z-index: -1;\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n    }\\n\\n    &:hover {\\n        transform: scale(1.1);\\n\\n        &::before {\\n            opacity: 1;\\n        }\\n    }\\n}\\n\\n.feedbacks__name {\\n    font-size: 24px;\\n    font-weight: 700;\\n    color: #FFFFFF;\\n    margin: 0;\\n    text-shadow: 0 0 10px rgba(205, 6, 255, 0.5);\\n    position: relative;\\n\\n    &::after {\\n        content: '';\\n        position: absolute;\\n        bottom: -8px;\\n        left: 50%;\\n        transform: translateX(-50%);\\n        width: 0;\\n        height: 2px;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        transition: width 0.3s ease;\\n    }\\n\\n    &:hover::after {\\n        width: 100%;\\n    }\\n}\\n\\n.feedbacks__text {\\n    font-size: 18px;\\n    line-height: 28px;\\n    color: rgba(255, 255, 255, 0.9);\\n    margin: 0;\\n    font-style: italic;\\n    position: relative;\\n    z-index: 1;\\n}\\n\\n.feedbacks__controls {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    gap: 30px;\\n    margin-top: 40px;\\n}\\n\\n.feedbacks__btn {\\n    width: 60px;\\n    height: 60px;\\n    border: 2px solid rgba(205, 6, 255, 0.3);\\n    border-radius: 50%;\\n    background: rgba(255, 255, 255, 0.05);\\n    backdrop-filter: blur(10px);\\n    color: rgba(255, 255, 255, 0.7);\\n    cursor: pointer;\\n    transition: all 0.3s ease;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    position: relative;\\n    overflow: hidden;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        opacity: 0;\\n        transition: opacity 0.3s ease;\\n        border-radius: 50%;\\n    }\\n\\n    &:hover {\\n        border-color: #CD06FF;\\n        color: #FFFFFF;\\n        transform: scale(1.1);\\n\\n        &::before {\\n            opacity: 0.2;\\n        }\\n    }\\n\\n    &:active {\\n        transform: scale(0.95);\\n    }\\n\\n    &:disabled {\\n        opacity: 0.3;\\n        cursor: not-allowed;\\n        transform: scale(1);\\n\\n        &:hover::before {\\n            opacity: 0;\\n        }\\n    }\\n}\\n\\n.feedbacks__icon {\\n    width: 24px;\\n    height: 24px;\\n    position: relative;\\n    z-index: 1;\\n}\\n\\n.feedbacks__dots {\\n    display: flex;\\n    gap: 15px;\\n    align-items: center;\\n}\\n\\n.feedbacks__dot {\\n    width: 12px;\\n    height: 12px;\\n    border-radius: 50%;\\n    background: rgba(255, 255, 255, 0.3);\\n    cursor: pointer;\\n    transition: all 0.3s ease;\\n    position: relative;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: -4px;\\n        left: -4px;\\n        right: -4px;\\n        bottom: -4px;\\n        border: 2px solid transparent;\\n        border-radius: 50%;\\n        transition: border-color 0.3s ease;\\n    }\\n\\n    &:hover {\\n        background: rgba(255, 255, 255, 0.6);\\n        transform: scale(1.2);\\n    }\\n\\n    &--active {\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n        transform: scale(1.3);\\n        box-shadow: 0 0 15px rgba(205, 6, 255, 0.6);\\n\\n        &::before {\\n            border-color: rgba(205, 6, 255, 0.3);\\n        }\\n    }\\n}\\n\\n@keyframes linesMove {\\n    0% { transform: translateX(0); }\\n    100% { transform: translateX(102px); }\\n}\\n\\n@keyframes titleFadeIn {\\n    from {\\n        opacity: 0;\\n        transform: translateY(-30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes lineGrow {\\n    from { scale: 0 1; }\\n    to { scale: 1 1; }\\n}\\n\\n@keyframes slideAppear {\\n    from {\\n        opacity: 0;\\n        transform: translateY(30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .feedbacks {\\n        padding: 70px 0;\\n    }\\n\\n    .feedbacks__title {\\n        margin-bottom: 60px;\\n    }\\n\\n    .feedbacks__item {\\n        padding: 40px;\\n    }\\n\\n    .feedbacks__image {\\n        width: 80px;\\n        height: 80px;\\n    }\\n\\n    .feedbacks__name {\\n        font-size: 20px;\\n    }\\n\\n    .feedbacks__text {\\n        font-size: 16px;\\n        line-height: 24px;\\n    }\\n\\n    .feedbacks__btn {\\n        width: 50px;\\n        height: 50px;\\n    }\\n\\n    .feedbacks__icon {\\n        width: 20px;\\n        height: 20px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .feedbacks {\\n        padding: 50px 0;\\n    }\\n\\n    .feedbacks__title {\\n        margin-bottom: 40px;\\n    }\\n\\n    .feedbacks__item {\\n        padding: 30px 20px;\\n\\n        &::before {\\n            font-size: 80px;\\n            top: -15px;\\n        }\\n    }\\n\\n    .feedbacks__image {\\n        width: 70px;\\n        height: 70px;\\n    }\\n\\n    .feedbacks__name {\\n        font-size: 18px;\\n    }\\n\\n    .feedbacks__text {\\n        font-size: 14px;\\n        line-height: 20px;\\n    }\\n\\n    .feedbacks__controls {\\n        gap: 20px;\\n        margin-top: 30px;\\n    }\\n\\n    .feedbacks__btn {\\n        width: 45px;\\n        height: 45px;\\n    }\\n\\n    .feedbacks__icon {\\n        width: 18px;\\n        height: 18px;\\n    }\\n\\n    .feedbacks__dots {\\n        gap: 10px;\\n    }\\n\\n    .feedbacks__dot {\\n        width: 10px;\\n        height: 10px;\\n    }\\n}\\n\",\".main-banner {\\n    position: relative;\\n\\n    &::before {\\n        content: '';\\n        position: absolute;\\n        top: 0;\\n        left: 0;\\n        right: 0;\\n        bottom: 0;\\n        animation: backgroundPulse 8s ease-in-out infinite;\\n    }\\n\\n    &__container {\\n        display: flex;\\n        justify-content: center;\\n        position: relative;\\n        z-index: 2;\\n    }\\n\\n    &__text-wrap {\\n        position: relative;\\n        height: 823px;\\n        max-width: 1180px;\\n        margin: 0 auto;\\n        flex-basis: 1174px;\\n        padding-top: 100px;\\n\\n        &:after {\\n            content: '';\\n            background-image: url('../img/main-banner.png');\\n            background-size: 675px 762px;\\n            width: 675px;\\n            height: 762px;\\n            display: inline-block;\\n            position: absolute;\\n            bottom: -62px;\\n            left: 500px;\\n            opacity: 0.9;\\n            animation: floatImage 6s ease-in-out infinite;\\n            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, transparent 100%);\\n        }\\n    }\\n\\n    &__subtitle {\\n        text-transform: uppercase;\\n        font-weight: 900;\\n        font-size: 150px;\\n        letter-spacing: -15px;\\n        line-height: 100%;\\n        margin: 0;\\n        padding: 0;\\n        background: linear-gradient(45deg, #CD06FF, #FF06CD, #CD06FF);\\n        background-size: 200% 200%;\\n        -webkit-background-clip: text;\\n        background-clip: text;\\n        -webkit-text-fill-color: transparent;\\n        animation: gradientShift 3s ease-in-out infinite;\\n        text-shadow: 0 0 50px rgba(205, 6, 255, 0.5);\\n    }\\n\\n    &__title {\\n        font-size: 28px;\\n        padding: 0 0 0 100px;\\n        line-height: 50px;\\n        font-weight: 400;\\n        margin: 0 0 30px 0;\\n        text-align: left;\\n        text-transform: unset;\\n        opacity: 0;\\n        animation: slideInLeft 1s ease-out 0.5s forwards;\\n    }\\n\\n    &__advantages {\\n        display: flex;\\n        flex-direction: row;\\n        gap: 40px;\\n        margin: 0 0 150px 0;\\n        opacity: 0;\\n        animation: slideInUp 1s ease-out 1s forwards;\\n    }\\n\\n    &__advantage {\\n        display: flex;\\n        flex-direction: column;\\n        align-items: center;\\n        justify-content: flex-end;\\n        flex-basis: 210px;\\n        transition: transform 0.3s ease;\\n\\n        &:hover {\\n            transform: translateY(-10px);\\n        }\\n    }\\n\\n    &__advantage-number {\\n        margin: 0;\\n        padding: 0;\\n        position: relative;\\n\\n        font-weight: 900;\\n        font-size: 100px;\\n        line-height: 141px;\\n        color: var(--neon-purple, #CD06FF);\\n        font-variant: small-caps;\\n        margin: 0;\\n        text-shadow: 0 0 30px rgba(205, 6, 255, 0.8);\\n        animation: numberPulse 2s ease-in-out infinite;\\n\\n        &::after {\\n            content: '';\\n            position: absolute;\\n            bottom: 15px;\\n            left: 50%;\\n            transform: translateX(-50%);\\n            width: 0;\\n            height: 3px;\\n            background: linear-gradient(45deg, #CD06FF, #FF06CD);\\n            transition: width 0.3s ease;\\n        }\\n\\n        &:hover::after {\\n            width: 100%;\\n        }\\n    }\\n\\n    &__advantage-text {\\n        margin: 0;\\n        padding: 0;\\n        transition: color 0.3s ease;\\n\\n        .main-banner__advantage:hover & {\\n            color: var(--neon-purple, #CD06FF);\\n        }\\n    }\\n\\n    &__link {\\n        display: inline-block;\\n        opacity: 0;\\n        animation: slideInUp 1s ease-out 1.5s forwards;\\n    }\\n\\n    &__button {\\n        background: linear-gradient(45deg, var(--dark-purple, #6C0287), var(--cold-purple, #640AA3));\\n        border: none;\\n        border-radius: 50px;\\n        width: 374px;\\n        height: 80px;\\n        box-shadow:\\n            0 0 30px rgba(205, 6, 255, 0.4),\\n            inset 0 1px 0 rgba(255, 255, 255, 0.1);\\n        font-weight: 700;\\n        font-size: 26px;\\n        line-height: 30px;\\n        text-transform: uppercase;\\n        color: var(--main-text-color, #FFFFFF);\\n        cursor: pointer;\\n        transition: all 0.3s ease;\\n        position: relative;\\n        overflow: hidden;\\n\\n        &::before {\\n            content: '';\\n            position: absolute;\\n            top: 0;\\n            left: -100%;\\n            width: 100%;\\n            height: 100%;\\n            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);\\n            transition: left 0.6s ease;\\n        }\\n\\n        &:hover {\\n            transform: translateY(-5px);\\n            box-shadow:\\n                0 15px 40px rgba(205, 6, 255, 0.6),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.2);\\n\\n            &::before {\\n                left: 100%;\\n            }\\n        }\\n\\n        &:focus {\\n            outline: 2px solid var(--neon-purple, #CD06FF);\\n        }\\n\\n        &:active {\\n            transform: translateY(-2px);\\n            box-shadow:\\n                0 8px 20px rgba(205, 6, 255, 0.4),\\n                inset 0 1px 0 rgba(255, 255, 255, 0.1);\\n        }\\n    }\\n\\n    &__scroll {\\n        width: 97px;\\n        height: 97px;\\n        display: inline-block;\\n        position: absolute;\\n        top: 646px;\\n        left: 536px;\\n        z-index: 99;\\n        opacity: 0;\\n        animation: fadeInBounce 1s ease-out 2s forwards;\\n    }\\n\\n    &__scroll-icon {\\n        border: 2px solid rgba(255, 255, 255, 0.6);\\n        border-radius: 50%;\\n        transition: all 0.4s ease;\\n        animation: scrollPulse 2s ease-in-out infinite;\\n\\n        &:hover {\\n            border-color: var(--neon-purple, #CD06FF);\\n            background: rgba(205, 6, 255, 0.1);\\n            transform: scale(1.1);\\n\\n            .main-banner__scroll-rect {\\n                fill: var(--neon-purple, #CD06FF);\\n            }\\n        }\\n\\n        &:active {\\n            background: var(--neon-purple, #CD06FF);\\n            border-color: var(--neon-purple, #CD06FF);\\n            transform: scale(0.95);\\n\\n            .main-banner__scroll-rect {\\n                fill: var(--main-text-color, #FFFFFF);\\n            }\\n        }\\n    }\\n\\n    &__scroll-circle {\\n        fill: transparent;\\n    }\\n\\n    &__scroll-rect {\\n        fill: rgba(255, 255, 255, 0.8);\\n        transition: fill 0.3s ease;\\n    }\\n}\\n\\n@keyframes backgroundPulse {\\n    0%, 100% { opacity: 1; }\\n    50% { opacity: 0.7; }\\n}\\n\\n@keyframes gradientShift {\\n    0%, 100% { background-position: 0% 50%; }\\n    50% { background-position: 100% 50%; }\\n}\\n\\n@keyframes slideInLeft {\\n    from {\\n        opacity: 0;\\n        transform: translateX(-50px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateX(0);\\n    }\\n}\\n\\n@keyframes slideInUp {\\n    from {\\n        opacity: 0;\\n        transform: translateY(30px);\\n    }\\n    to {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes fadeInBounce {\\n    0% {\\n        opacity: 0;\\n        transform: translateY(20px);\\n    }\\n    60% {\\n        opacity: 1;\\n        transform: translateY(-5px);\\n    }\\n    100% {\\n        opacity: 1;\\n        transform: translateY(0);\\n    }\\n}\\n\\n@keyframes floatImage {\\n    0%, 100% { transform: translateY(0px) rotate(0deg); }\\n    50% { transform: translateY(-20px) rotate(1deg); }\\n}\\n\\n@keyframes numberPulse {\\n    0%, 100% {\\n        text-shadow: 0 0 30px rgba(205, 6, 255, 0.8);\\n        transform: scale(1);\\n    }\\n    50% {\\n        text-shadow: 0 0 40px rgba(205, 6, 255, 1);\\n        transform: scale(1.02);\\n    }\\n}\\n\\n@keyframes scrollPulse {\\n    0%, 100% {\\n        opacity: 0.8;\\n        transform: translateY(0);\\n    }\\n    50% {\\n        opacity: 1;\\n        transform: translateY(-5px);\\n    }\\n}\\n\\n@media screen and (max-width: 1320px) {\\n    .main-banner {\\n        padding: 30px 60px 40px 60px;\\n\\n        &__text-wrap {\\n            flex-basis: 904px;\\n            height: 583px;\\n\\n            &:after {\\n                background-size: 453px 520px;\\n                width: 453px;\\n                height: 520px;\\n                top: 63px;\\n                left: 459px;\\n            }\\n        }\\n\\n        &__subtitle {\\n            font-size: 120px;\\n            letter-spacing: -11px;\\n            margin: 0 0 20px 0;\\n        }\\n\\n        &__title {\\n            padding: 0 0 0 100px;\\n            font-size: 22px;\\n            line-height: 30px;\\n            margin: 0 0 30px 0;\\n        }\\n\\n        &__advantages {\\n            margin: 0 0 80px 0;\\n        }\\n\\n        &__button {\\n            border-radius: 10px;\\n            margin: 0 0 0 40px;\\n            width: 296px;\\n            height: 64px;\\n            font-size: 22px;\\n            line-height: 30px;\\n        }\\n\\n        &__scroll {\\n            width: 67px;\\n            height: 67px;\\n            top: 471px;\\n            left: 432px;\\n        }\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .main-banner {\\n        padding: 30px 40px 40px 40px;\\n\\n        &__text-wrap {\\n            flex-basis: 688px;\\n            height: 537px;\\n\\n            &:after {\\n                background-size: 409px 479px;\\n                width: 409px;\\n                height: 479px;\\n                top: 57px;\\n                left: 283px;\\n            }\\n        }\\n\\n        &__subtitle {\\n            font-size: 86px;\\n            line-height: 86px;\\n            letter-spacing: -8px;\\n        }\\n\\n        &__title {\\n            padding: 0 0 0 60px;\\n            font-size: 18px;\\n            line-height: 24px;\\n            margin: 0 0 50px 0;\\n        }\\n\\n        &__advantages {\\n            gap: 32px;\\n        }\\n\\n        &__button {\\n            margin: unset;\\n            border-radius: 4px;\\n            width: 214px;\\n            height: 46px;\\n            font-size: 16px;\\n            line-height: 24px;\\n\\n            &:hover,\\n            &:focus,\\n            &:active {\\n                border-radius: 4px;\\n            }\\n        }\\n\\n        &__scroll {\\n            display: none;\\n        }\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .main-banner {\\n        padding: 20px 20px 30px 20px;\\n\\n        &__text-wrap {\\n            flex-basis: 280px;\\n            height: 204px;\\n\\n            &:after {\\n                background-size: cover;\\n                width: 161px;\\n                height: 179px;\\n                top: 23px;\\n                left: 119px;\\n            }\\n        }\\n\\n        &__subtitle {\\n            font-size: 35px;\\n            line-height: 35px;\\n            letter-spacing: -3px;\\n            margin: 0 0 6px 0;\\n        }\\n\\n        &__title {\\n            font-size: 10px;\\n            line-height: 14px;\\n            padding: 0 0 0 15px;\\n            margin: 0 0 10px 0;\\n        }\\n\\n        &__advantages {\\n            margin: 0 0 30px 0;\\n            gap: 20px;\\n        }\\n\\n        &__button {\\n            margin: unset;\\n            border-radius: 4px;\\n            width: 117px;\\n            height: 27px;\\n            font-size: 10px;\\n            line-height: 12px;\\n        }\\n    }\\n}\\n\",\".room {\\n    padding: 50px 0 100px 0;\\n}\\n\\n.room__list {\\n    display: flex;\\n    flex-wrap: wrap;\\n    justify-content: center;\\n    gap: 20px;\\n    flex-direction: row;\\n    align-items: center;\\n    list-style-type: none;\\n}\\n\\n.room__item {\\n    background-size: cover;\\n    background-repeat: no-repeat;\\n    width: 580px;\\n    height: 349px;\\n    flex-basis: 580px;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    position: relative;\\n    transition: 0.4s;\\n\\n    &:hover {\\n        transform: scale(1.1);\\n        box-shadow: 0 0 20px 1px var(--dark-purple, #6C0287);\\n    }\\n}\\n\\n.room__image {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: 100%;\\n    height: 100%;\\n    object-fit: cover;\\n    z-index: -1;\\n}\\n\\n.room__description {\\n    position: absolute;\\n    text-transform: uppercase;\\n    font-weight: 700;\\n    font-size: 70px;\\n    white-space: pre-line;\\n    text-align: center;\\n    line-height: 80px;\\n    margin: 0;\\n    z-index: 1;\\n}\\n\\n@media screen and (max-width: 1320px) {\\n    .room {\\n        padding: 35px 0 70px 0;\\n    }\\n\\n    .room__list {\\n        gap: 18px;\\n    }\\n\\n    .room__item {\\n        width: 443px;\\n        height: 267px;\\n        flex-basis: 443px;\\n    }\\n\\n    .room__description {\\n        font-size: 50px;\\n        line-height: 60px;\\n    }\\n}\\n\\n@media screen and (max-width: 1023px) {\\n    .room__item {\\n        width: 335px;\\n        height: 200px;\\n        flex-basis: 335px;\\n    }\\n\\n    .room__description {\\n        font-size: 40px;\\n        line-height: 50px;\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .room__item {\\n        width: 280px;\\n        height: 168px;\\n    }\\n}\\n\\n@media screen and (max-width: 630px) {\\n    .room {\\n        padding: 15px 20px 30px 20px;\\n    }\\n\\n    .room__item {\\n        flex-basis: 280px;\\n    }\\n\\n    .room__description {\\n        font-size: 26px;\\n        line-height: 34px;\\n    }\\n}\\n\",\".modal {\\n    position: fixed;\\n    top: 0;\\n    left: 0;\\n    width: 100%;\\n    height: 100%;\\n    z-index: 1000;\\n    opacity: 0;\\n    visibility: hidden;\\n    transition: opacity 0.3s ease, visibility 0.3s ease;\\n\\n    &--active {\\n        opacity: 1;\\n        visibility: visible;\\n    }\\n}\\n\\n.modal__overlay {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: 100%;\\n    height: 100%;\\n    background-color: rgba(0, 0, 0, 0.8);\\n    cursor: pointer;\\n}\\n\\n.modal__content {\\n    position: absolute;\\n    top: 50%;\\n    left: 50%;\\n    transform: translate(-50%, -50%);\\n    background-color: var(--main-background-color, #1B1A1B);\\n    border: 2px solid var(--neon-purple, #CD06FF);\\n    border-radius: 15px;\\n    width: 90%;\\n    max-width: 500px;\\n    max-height: 90vh;\\n    overflow-y: auto;\\n    padding: 40px;\\n}\\n\\n.modal__close {\\n    position: absolute;\\n    top: 20px;\\n    right: 20px;\\n    background: transparent;\\n    border: none;\\n    color: var(--main-text-color, #FFFFFF);\\n    cursor: pointer;\\n    padding: 5px;\\n    transition: color 0.3s ease;\\n\\n    &:hover {\\n        color: var(--neon-purple, #CD06FF);\\n    }\\n}\\n\\n.modal__header {\\n    margin-bottom: 30px;\\n    text-align: center;\\n}\\n\\n.modal__title {\\n    font-size: 28px;\\n    font-weight: 700;\\n    color: var(--main-text-color, #FFFFFF);\\n    text-transform: uppercase;\\n}\\n\\n.modal__body {\\n\\n}\\n\\n.modal__form {\\n\\n}\\n\\n.modal__form-group {\\n    margin-bottom: 20px;\\n}\\n\\n.modal__input {\\n    width: 100%;\\n    height: 50px;\\n    background-color: transparent;\\n    border: 2px solid var(--neon-purple, #CD06FF);\\n    border-radius: 8px;\\n    padding: 15px;\\n    color: var(--main-text-color, #FFFFFF);\\n    font-size: 16px;\\n    transition: border-color 0.3s ease;\\n\\n    &::placeholder {\\n        color: rgba(255, 255, 255, 0.6);\\n    }\\n\\n    &:focus {\\n        outline: none;\\n        border-color: var(--dark-purple, #6C0287);\\n    }\\n}\\n\\n.modal__textarea {\\n    width: 100%;\\n    background-color: transparent;\\n    border: 2px solid var(--neon-purple, #CD06FF);\\n    border-radius: 8px;\\n    padding: 15px;\\n    color: var(--main-text-color, #FFFFFF);\\n    font-size: 16px;\\n    resize: vertical;\\n    font-family: inherit;\\n    transition: border-color 0.3s ease;\\n\\n    &::placeholder {\\n        color: rgba(255, 255, 255, 0.6);\\n    }\\n\\n    &:focus {\\n        outline: none;\\n        border-color: var(--dark-purple, #6C0287);\\n    }\\n}\\n\\n.modal__submit {\\n    width: 100%;\\n    height: 55px;\\n    background-color: transparent;\\n    border: 3px solid var(--neon-purple, #CD06FF);\\n    border-radius: 10px;\\n    color: var(--main-text-color, #FFFFFF);\\n    font-size: 18px;\\n    font-weight: 700;\\n    text-transform: uppercase;\\n    cursor: pointer;\\n    transition: background-color 0.4s ease, border-color 0.4s ease;\\n\\n    &:hover {\\n        background-color: var(--dark-purple, #6C0287);\\n        border-color: var(--dark-purple, #6C0287);\\n    }\\n\\n    &:focus {\\n        outline: none;\\n        background-color: var(--dark-purple, #6C0287);\\n        border-color: var(--dark-purple, #6C0287);\\n    }\\n\\n    &:active {\\n        background-color: var(--cold-purple, #640AA3);\\n        border-color: var(--cold-purple, #640AA3);\\n    }\\n}\\n\\n@media screen and (max-width: 767px) {\\n    .modal__content {\\n        padding: 30px 20px;\\n        width: 95%;\\n    }\\n\\n    .modal__title {\\n        font-size: 24px;\\n    }\\n\\n    .modal__input,\\n    .modal__textarea {\\n        font-size: 14px;\\n    }\\n\\n    .modal__submit {\\n        font-size: 16px;\\n        height: 50px;\\n    }\\n}\\n\"],\"sourceRoot\":\"\"}]);\n3751 | // Exports\n3752 | /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n3753 | ");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./resources/js/app.js");
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./resources/scss/app.scss");
/******/ 	
/******/ })()
;
//# sourceMappingURL=app.js.map