import { r as registerInstance, h as h$1, c as getElement } from './core-5e12a2de.js';

function isAbsolute(iri) {
    return iri.indexOf(":") !== -1;
}
function hasProtocol(iri) {
    return iri.indexOf("://") !== -1;
}
function isRelative(iri) {
    return !isAbsolute(iri);
}
function isIRI(iri) {
    return hasProtocol(iri) || !isAbsolute(iri);
}
function isBNodeLabel(label) {
    return /^_:/.test(label);
}
function isPrefixed(iri) {
    return /^(?!_:)[^]*?:/.test(iri) && !hasProtocol(iri);
}

function hasFunction(object, functionName) {
    return typeof object[functionName] === "function";
}
function hasProperty(object, property) {
    if (!object)
        return false;
    return isDefined(object[property]);
}
function hasPropertyDefined(object, property) {
    if (!object)
        return false;
    return !!Object.getOwnPropertyDescriptor(object, property);
}
function isDefined(value) {
    return void 0 !== value;
}
function isNull(value) {
    return value === null;
}
function isArray(object) {
    return Array.isArray(object);
}
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
function isBoolean(value) {
    return typeof value === "boolean";
}
function isNumber(value) {
    return typeof value === "number" || value instanceof Number;
}
function isInteger(value) {
    if (!isNumber(value))
        return false;
    return value % 1 === 0;
}
function isDouble(value) {
    if (!isNumber(value))
        return false;
    return value % 1 !== 0;
}
function isDate(date) {
    return date instanceof Date || (typeof date === "object" && Object.prototype.toString.call(date) === "[object Date]");
}
function isObject(object) {
    return typeof object === "object" && (!!object);
}
function isPlainObject(object) {
    return isObject(object)
        && !isArray(object)
        && !isDate(object)
        && !isMap(object)
        && !(typeof Blob !== "undefined" && object instanceof Blob)
        && !(Object.prototype.toString.call(object) === "[object Set]");
}
function isFunction(value) {
    return typeof value === "function";
}
function isMap(value) {
    return (isObject(value) &&
        hasFunction(value, "get") &&
        hasFunction(value, "has") &&
        hasProperty(value, "size") &&
        hasFunction(value, "clear") &&
        hasFunction(value, "delete") &&
        hasFunction(value, "entries") &&
        hasFunction(value, "forEach") &&
        hasFunction(value, "get") &&
        hasFunction(value, "has") &&
        hasFunction(value, "keys") &&
        hasFunction(value, "set") &&
        hasFunction(value, "values"));
}
function parseBoolean(value) {
    if (!isString(value))
        return false;
    switch (value.toLowerCase()) {
        case "true":
        case "yes":
        case "y":
        case "1":
            return true;
        case "false":
        case "no":
        case "n":
        case "0":
        default:
            return false;
    }
}
function promiseMethod(fn) {
    return new Promise(resolve => resolve(fn ? fn() : void 0));
}
class ArrayUtils {
    static from(iterator) {
        let array = [];
        let next = iterator.next();
        while (!next.done) {
            array.push(next.value);
            next = iterator.next();
        }
        return array;
    }
    static joinWithoutDuplicates(...arrays) {
        let result = arrays[0].slice();
        for (let i = 1, length = arrays.length; i < length; i++) {
            result = result.concat(arrays[i].filter(function (item) {
                return result.indexOf(item) < 0;
            }));
        }
        return result;
    }
}
class ObjectUtils {
    static extend(target, source, config = { arrays: false, objects: false }) {
        if (!isArray(source) && !isPlainObject(source) || !isArray(target) && !isPlainObject(target))
            return;
        source.__CarbonSDK_circularReferenceFlag = target;
        for (const key of Object.keys(source)) {
            if (isFunction(source[key]) || key === "__CarbonSDK_circularReferenceFlag")
                continue;
            let property = source[key];
            if (isArray(property) && config.arrays || isPlainObject(property) && config.objects) {
                if ("__CarbonSDK_circularReferenceFlag" in property) {
                    property = property.__CarbonSDK_circularReferenceFlag;
                }
                else {
                    property = !(key in target) || target[key].constructor !== property.constructor ?
                        ObjectUtils.clone(property, config) :
                        ObjectUtils.extend(target[key], property, config);
                }
            }
            if (property === null) {
                if (target[key])
                    delete target[key];
                continue;
            }
            target[key] = property;
        }
        delete source.__CarbonSDK_circularReferenceFlag;
        return target;
    }
    static clone(object, config = { arrays: false, objects: false }) {
        let isAnArray = isArray(object);
        if (!isAnArray && !isPlainObject(object))
            return;
        let clone = (isAnArray ? [] : Object.create(Object.getPrototypeOf(object)));
        return ObjectUtils.extend(clone, object, config);
    }
    static areEqual(object1, object2, config = { arrays: false, objects: false }, ignore = {}) {
        return internalAreEqual(object1, object2, config, [object1], [object2], ignore);
    }
    static areShallowlyEqual(object1, object2) {
        if (object1 === object2)
            return true;
        if (!isObject(object1) || !isObject(object2))
            return false;
        let properties = [];
        for (let propertyName in object1) {
            if (!object1.hasOwnProperty(propertyName))
                continue;
            if (isFunction(object1[propertyName]))
                continue;
            if (!(propertyName in object2))
                return false;
            if (object1[propertyName] !== object2[propertyName])
                return false;
            properties.push(propertyName);
        }
        for (let propertyName in object2) {
            if (!object2.hasOwnProperty(propertyName))
                continue;
            if (isFunction(object2[propertyName]))
                continue;
            if (!(propertyName in object1))
                return false;
            if (properties.indexOf(propertyName) === -1)
                return false;
        }
        return true;
    }
}
function internalAreEqual(object1, object2, config, stack1, stack2, ignore = {}) {
    if (object1 === object2)
        return true;
    if (!isObject(object1) || !isObject(object2))
        return false;
    if (isDate(object1))
        return object1.getTime() === object2.getTime();
    let keys = ArrayUtils.joinWithoutDuplicates(Object.keys(object1), Object.keys(object2));
    for (let key of keys) {
        if (key in ignore)
            continue;
        if (!(key in object1) || !(key in object2))
            return false;
        if (typeof object1[key] !== typeof object2[key])
            return false;
        if (isFunction(object1[key]))
            continue;
        let firstIsPlainObject = isPlainObject(object1[key]);
        if (isArray(object1[key]) && config.arrays ||
            firstIsPlainObject && config.objects ||
            isDate(object1[key])) {
            if (firstIsPlainObject) {
                let lengthStack = stack1.length;
                while (lengthStack--) {
                    if (stack1[lengthStack] === object1[key])
                        return stack2[lengthStack] === object2[key];
                }
                stack1.push(object1[key]);
                stack2.push(object2[key]);
            }
            if (!internalAreEqual(object1[key], object2[key], config, stack1, stack2))
                return false;
            if (firstIsPlainObject) {
                stack1.pop();
                stack2.pop();
            }
        }
        else {
            if (object1[key] !== object2[key])
                return false;
        }
    }
    return true;
}
class StringUtils {
    static startsWith(str, substring) {
        return str.lastIndexOf(substring, 0) === 0;
    }
    static endsWith(str, substring) {
        return str.indexOf(substring, str.length - substring.length) !== -1;
    }
    static contains(str, substring) {
        return str.indexOf(substring) !== -1;
    }
}
class MapUtils {
    static from(object) {
        let map = new Map();
        for (const name of Object.keys(object)) {
            map.set(name, object[name]);
        }
        return map;
    }
    static extend(toExtend, ...extenders) {
        for (const extender of extenders) {
            if (!extender)
                continue;
            extender.forEach((value, key) => toExtend.set(key, value));
        }
        return toExtend;
    }
}
class UUIDUtils {
    static is(uuid) {
        return UUIDUtils.regExp.test(uuid);
    }
    static generate() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0;
            let v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
UUIDUtils.regExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function _isExistingValue(value) {
    return value !== null && value !== void 0;
}

const Utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hasFunction: hasFunction,
    hasProperty: hasProperty,
    hasPropertyDefined: hasPropertyDefined,
    isDefined: isDefined,
    isNull: isNull,
    isArray: isArray,
    isString: isString,
    isBoolean: isBoolean,
    isNumber: isNumber,
    isInteger: isInteger,
    isDouble: isDouble,
    isDate: isDate,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isFunction: isFunction,
    isMap: isMap,
    parseBoolean: parseBoolean,
    promiseMethod: promiseMethod,
    ArrayUtils: ArrayUtils,
    ObjectUtils: ObjectUtils,
    StringUtils: StringUtils,
    MapUtils: MapUtils,
    UUIDUtils: UUIDUtils,
    _isExistingValue: _isExistingValue
});

const ModelDecorator = {
    hasPropertiesFrom(prototype, object) {
        const prototypeKeys = Object
            .keys(prototype);
        const shouldAddDollar = "$id" in object
            && !prototypeKeys.some(key => key.startsWith("$"));
        return prototypeKeys
            .every(key => {
            const targetKey = shouldAddDollar ?
                "$" + key : key;
            const definition = Object
                .getOwnPropertyDescriptor(prototype, key);
            if (!definition)
                return false;
            const targetDefinition = Object
                .getOwnPropertyDescriptor(object, targetKey);
            if (!targetDefinition)
                return false;
            if (isFunction(definition.value))
                return isFunction(targetDefinition.value);
            return !targetDefinition.enumerable;
        });
    },
    definePropertiesFrom(prototype, object) {
        const prototypeKeys = Object
            .keys(prototype);
        const shouldAddDollar = "$id" in object
            && !prototypeKeys.some(key => key.startsWith("$"));
        prototypeKeys
            .forEach(key => {
            const targetKey = shouldAddDollar ?
                "$" + key : key;
            const definition = Object
                .getOwnPropertyDescriptor(prototype, key);
            const descriptor = {
                enumerable: false,
                configurable: true,
            };
            if (isFunction(definition.value)) {
                descriptor.writable = false;
                descriptor.value = definition.value;
            }
            else if (!definition.set) {
                descriptor.writable = true;
                descriptor.value = object.hasOwnProperty(targetKey) ?
                    object[targetKey] : definition.get ?
                    definition.get() : definition.value;
            }
            else {
                descriptor.get = definition.get;
                descriptor.set = definition.set;
            }
            Object.defineProperty(object, targetKey, descriptor);
        });
        return object;
    },
    decorateMultiple(object, ...models) {
        models.forEach(model => model.decorate(object));
        return object;
    },
};

class AbstractError extends Error {
    get name() { return "AbstractError"; }
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        "captureStackTrace" in Error && Error.captureStackTrace(this, this.constructor);
    }
}

class IllegalArgumentError extends AbstractError {
    get name() { return "IllegalArgumentError"; }
}

const URI = {
    hasFragment(uri) {
        return uri.indexOf("#") !== -1;
    },
    hasQuery(uri) {
        return uri.indexOf("?") !== -1;
    },
    hasProtocol(uri) {
        return StringUtils.startsWith(uri, "https://") || StringUtils.startsWith(uri, "http://");
    },
    isAbsolute(uri) {
        return StringUtils.startsWith(uri, "http://")
            || StringUtils.startsWith(uri, "https://")
            || StringUtils.startsWith(uri, "://");
    },
    isRelative(uri) {
        return !URI.isAbsolute(uri);
    },
    isBNodeID(uri) {
        return StringUtils.startsWith(uri, "_:");
    },
    generateBNodeID() {
        return "_:" + UUIDUtils.generate();
    },
    isPrefixed(uri) {
        return !URI.isAbsolute(uri) && !URI.isBNodeID(uri) && StringUtils.contains(uri, ":");
    },
    isFragmentOf(fragmentURI, uri) {
        if (!URI.hasFragment(fragmentURI))
            return false;
        const documentURI = URI.getDocumentURI(fragmentURI);
        return documentURI === "" || documentURI === uri;
    },
    isBaseOf(baseURI, uri) {
        if (baseURI === uri)
            return true;
        if (baseURI === "")
            return true;
        if (URI.isRelative(uri) && !URI.isPrefixed(uri))
            return true;
        if (uri.startsWith(baseURI)) {
            if (StringUtils.endsWith(baseURI, "/") || StringUtils.endsWith(baseURI, "#"))
                return true;
            let relativeURI = uri.substring(baseURI.length);
            if (StringUtils.startsWith(relativeURI, "/") || StringUtils.startsWith(relativeURI, "#"))
                return true;
        }
        return false;
    },
    getRelativeURI(absoluteURI, base) {
        if (!absoluteURI.startsWith(base))
            return absoluteURI;
        return absoluteURI.substring(base.length);
    },
    getDocumentURI(uri) {
        let parts = uri.split("#");
        if (parts.length > 2)
            throw new IllegalArgumentError("The URI provided has more than one # sign.");
        return parts[0];
    },
    getFragment(uri) {
        let parts = uri.split("#");
        if (parts.length < 2)
            throw new IllegalArgumentError("The URI provided hasn't a # sign.");
        if (parts.length > 2)
            throw new IllegalArgumentError("The URI provided has more than one # sign.");
        return parts[1];
    },
    getSlug(uri) {
        let uriParts = uri.split("#");
        if (uriParts.length === 2)
            return URI.getSlug(uriParts[1]);
        if (uriParts.length > 2)
            throw new IllegalArgumentError("Invalid URI: The uri contains two '#' symbols.");
        uri = uriParts[0];
        if (uri === "")
            return uri;
        if (uri === "/")
            return "";
        let parts = uri.split("/");
        if (parts[parts.length - 1] === "") {
            return parts[parts.length - 2];
        }
        else {
            return parts[parts.length - 1];
        }
    },
    getParameters(uri) {
        const parameters = new Map();
        if (!URI.hasQuery(uri))
            return parameters;
        uri.replace(/^.*\?/, "").split("&").forEach((param) => {
            const parts = param
                .replace(/\+/g, " ")
                .split("=");
            const key = parts.shift();
            const val = parts.length > 0 ? parts.join("=") : "";
            if (!parameters.has(key)) {
                parameters.set(key, val);
            }
            else {
                parameters.set(key, new Array().concat(parameters.get(key), val));
            }
        });
        return parameters;
    },
    resolve(parentURI, childURI) {
        if (!parentURI || URI.isAbsolute(childURI) || URI.isBNodeID(childURI) || URI.isPrefixed(childURI))
            return childURI;
        let protocol = parentURI.substr(0, parentURI.indexOf("://") + 3);
        let path = parentURI.substr(parentURI.indexOf("://") + 3, parentURI.length - 1);
        if (path.lastIndexOf("/") === -1)
            path += "/";
        if (StringUtils.startsWith(childURI, "?") || StringUtils.startsWith(childURI, "#")) {
            if (URI.hasQuery(path))
                path = path.substr(0, path.indexOf("?"));
            if (URI.hasFragment(path) && (!StringUtils.startsWith(childURI, "?") || StringUtils.endsWith(path, "#")))
                path = URI.getDocumentURI(path);
        }
        else {
            path = path.substr(0, path.lastIndexOf("/") + 1);
            if (!StringUtils.endsWith(path, "?") && !StringUtils.endsWith(path, "#") && !StringUtils.endsWith(path, "/"))
                path += "/";
        }
        if (StringUtils.startsWith(childURI, "/")) {
            childURI = childURI.substr(1, childURI.length);
        }
        return protocol + path + childURI;
    },
    removeProtocol(uri) {
        if (!URI.hasProtocol(uri))
            return uri;
        return uri.substring(uri.indexOf("://") + 3);
    },
    prefix(uri, prefixOrObjectSchema, prefixURI) {
        if (!isString(prefixOrObjectSchema))
            return prefixWithObjectSchema(uri, prefixOrObjectSchema);
        const prefix = prefixOrObjectSchema;
        if (URI.isPrefixed(uri) || !uri.startsWith(prefixURI))
            return uri;
        return `${prefix}:${uri.substring(prefixURI.length)}`;
    },
};
function prefixWithObjectSchema(uri, objectSchema) {
    const prefixEntries = objectSchema.prefixes.entries();
    while (true) {
        const result = prefixEntries.next();
        if (result.done)
            return uri;
        let [prefix, prefixURI] = result.value;
        if (!URI.isAbsolute(prefixURI))
            continue;
        if (!uri.startsWith(prefixURI))
            continue;
        return URI.prefix(uri, prefix, prefixURI);
    }
}

class IDAlreadyInUseError extends AbstractError {
    get name() { return "IDAlreadyInUseError"; }
}

const Pointer = {
    PROTOTYPE: {
        get $id() { return ""; },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(Pointer.PROTOTYPE, object);
    },
    decorate(object) {
        if (Pointer.isDecorated(object))
            return object;
        return ModelDecorator
            .definePropertiesFrom(Pointer.PROTOTYPE, object);
    },
    is(value) {
        return isObject(value)
            && Pointer.isDecorated(value);
    },
    create(data) {
        const clone = Object.assign({}, data);
        return Pointer.createFrom(clone);
    },
    createFrom(object) {
        return Pointer.decorate(object);
    },
    areEqual(pointer1, pointer2) {
        return pointer1.$id === pointer2.$id;
    },
    getIDs(pointers) {
        return pointers
            .map(pointer => pointer.$id);
    },
    getID(pointerOrIRI) {
        return isObject(pointerOrIRI) ? pointerOrIRI.$id : pointerOrIRI;
    },
};

const BiModelDecorator = {
    hasPropertiesFrom(prototype, object) {
        return ModelDecorator.hasPropertiesFrom(prototype, object);
    },
    definePropertiesFrom(prototype, object) {
        if ("$id" in object)
            Pointer
                .decorate(object);
        return ModelDecorator
            .definePropertiesFrom(prototype, object);
    },
    decorateMultiple: ModelDecorator.decorateMultiple,
};

function __getResourcesMaps(registry) {
    return "$id" in registry ? registry.$__resourcesMap : registry.__resourcesMap;
}
function __getParentResource(registry) {
    return "$id" in registry ? registry.$registry : registry.registry;
}
function __getDecorator(registry) {
    return "$id" in registry ?
        registry.$__modelDecorator : registry.__modelDecorator;
}
function __getLocalID(registry, id) {
    return "$id" in registry ?
        registry.$_getLocalID(id) : registry._getLocalID(id);
}
function __addPointer(registry, pointer) {
    return "$id" in registry ?
        registry.$_addPointer(pointer) : registry._addPointer(pointer);
}
function __inScope(idOrPointer, local) {
    if (!this)
        return false;
    try {
        const id = Pointer.getID(idOrPointer);
        __getLocalID(this, id);
        return true;
    }
    catch (_a) {
        if (local === true)
            return false;
        const parentRegistry = __getParentResource(this);
        return __inScope.call(parentRegistry, idOrPointer);
    }
}
function __hasPointer(id, local) {
    if (!this)
        return false;
    if (__inScope.call(this, id, true)) {
        const localID = __getLocalID(this, id);
        const resourcesMap = __getResourcesMaps(this);
        if (resourcesMap.has(localID))
            return true;
    }
    if (local === true)
        return false;
    const parentRegistry = __getParentResource(this);
    return __hasPointer.call(parentRegistry, id);
}
function __getPointer(id, local) {
    const parentRegistry = __getParentResource(this);
    if (!__inScope.call(this, id, true)) {
        if (local === true || !parentRegistry)
            throw new IllegalArgumentError(`"${id}" is out of scope.`);
        return __getPointer.call(parentRegistry, id);
    }
    const localID = __getLocalID(this, id);
    const resourcesMap = __getResourcesMaps(this);
    if (resourcesMap.has(localID))
        return resourcesMap.get(localID);
    if (local !== true && __hasPointer.call(parentRegistry, id))
        return __getPointer.call(parentRegistry, id);
    return __addPointer(this, { $id: id });
}
function __getPointers(local) {
    const resourcesMap = __getResourcesMaps(this);
    const pointers = Array.from(resourcesMap.values());
    const parentRegistry = __getParentResource(this);
    if (local === true || !parentRegistry)
        return pointers;
    return [
        ...__getPointers.call(parentRegistry),
        ...pointers,
    ];
}
function __removePointer(idOrPointer, local) {
    if (!this)
        return false;
    const id = Pointer.getID(idOrPointer);
    if (__inScope.call(this, id, true)) {
        const localID = __getLocalID(this, id);
        const resourcesMap = __getResourcesMaps(this);
        if (resourcesMap.delete(localID))
            return true;
    }
    if (local === true)
        return false;
    const parentRegistry = __getParentResource(this);
    return __removePointer.call(parentRegistry, idOrPointer);
}
const Registry = {
    PROTOTYPE: {
        registry: void 0,
        get __modelDecorator() {
            throw new IllegalArgumentError(`Property "__modelDecorator" is required`);
        },
        get __resourcesMap() { return new Map(); },
        inScope: __inScope,
        hasPointer: __hasPointer,
        getPointer: __getPointer,
        getPointers: __getPointers,
        removePointer: __removePointer,
        _addPointer(pointer) {
            if (!pointer.$id)
                throw new IllegalArgumentError("The pointer $id cannot be empty.");
            const localID = __getLocalID(this, pointer.$id);
            const resourcesMap = __getResourcesMaps(this);
            if (resourcesMap.has(localID))
                throw new IDAlreadyInUseError(`"${pointer.$id}" is already being used.`);
            const resource = __getDecorator(this)
                .decorate(Object.assign(pointer, {
                $registry: this,
            }));
            resourcesMap.set(localID, resource);
            return resource;
        },
        _getLocalID(id) {
            return id;
        },
    },
    isDecorated(object) {
        return BiModelDecorator
            .hasPropertiesFrom(Registry.PROTOTYPE, object);
    },
    decorate(object) {
        if (Registry.isDecorated(object))
            return object;
        return BiModelDecorator
            .definePropertiesFrom(Registry.PROTOTYPE, object);
    },
};

var ContainerType;
(function (ContainerType) {
    ContainerType[ContainerType["SET"] = 0] = "SET";
    ContainerType[ContainerType["LIST"] = 1] = "LIST";
    ContainerType[ContainerType["LANGUAGE"] = 2] = "LANGUAGE";
})(ContainerType || (ContainerType = {}));

function _getPointer(pointerLibrary, id) {
    return "$id" in pointerLibrary ?
        pointerLibrary.$getPointer(id) :
        pointerLibrary.getPointer(id);
}

const RDFList = {
    is(value) {
        return hasPropertyDefined(value, "@list");
    },
};

function pad(value) {
    let paddedValue = String(value);
    if (paddedValue.length === 1)
        paddedValue = "0" + paddedValue;
    return paddedValue;
}
const notNumberError = "The value is not a number.";
class DateSerializer {
    serialize(value) {
        if (!isDate(value))
            throw new IllegalArgumentError("The value is not a Date object.");
        return value.getUTCFullYear() + "-" + pad((value.getUTCMonth() + 1)) + "-" + pad(value.getUTCDate());
    }
}
let dateSerializer = new DateSerializer();
class DateTimeSerializer {
    serialize(value) {
        if (!isDate(value))
            throw new IllegalArgumentError("The value is not a Date object.");
        return value.toISOString();
    }
}
let dateTimeSerializer = new DateTimeSerializer();
class TimeSerializer {
    serialize(value) {
        if (!isDate(value))
            throw new IllegalArgumentError("The value is not a Date object.");
        return pad(value.getUTCHours())
            + ":" + pad(value.getUTCMinutes())
            + ":" + pad(value.getUTCSeconds())
            + "." + String((value.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
            + "Z";
    }
}
let timeSerializer = new TimeSerializer();
class IntegerSerializer {
    serialize(value) {
        if (!isNumber(value))
            throw new IllegalArgumentError(notNumberError);
        return (~~value).toString();
    }
}
let integerSerializer = new IntegerSerializer();
class LongSerializer {
    serialize(value) {
        if (!isNumber(value))
            throw new IllegalArgumentError(notNumberError);
        if (value === Number.POSITIVE_INFINITY)
            return "0";
        if (value === Number.NEGATIVE_INFINITY)
            return "0";
        if (Number.isNaN(value))
            return "0";
        return Math.trunc(value).toString();
    }
}
const longSerializer = new LongSerializer();
class UnsignedIntegerSerializer extends IntegerSerializer {
    serialize(value) {
        let stringValue = super.serialize(value);
        stringValue = StringUtils.startsWith(stringValue, "-") ? stringValue.substring(1) : stringValue;
        return stringValue;
    }
}
let unsignedIntegerSerializer = new UnsignedIntegerSerializer();
class UnsignedLongSerializer {
    serialize(value) {
        if (!isNumber(value))
            throw new IllegalArgumentError(notNumberError);
        if (value === Number.POSITIVE_INFINITY)
            return "0";
        if (value === Number.NEGATIVE_INFINITY)
            return "0";
        if (Number.isNaN(value))
            return "0";
        return Math.trunc(Math.abs(value)).toString();
    }
}
const unsignedLongSerializer = new UnsignedLongSerializer();
class FloatSerializer {
    serialize(value) {
        if (value === Number.POSITIVE_INFINITY)
            return "INF";
        if (value === Number.NEGATIVE_INFINITY)
            return "-INF";
        if (!isNumber(value))
            throw new IllegalArgumentError(notNumberError);
        return value.toString();
    }
}
let floatSerializer = new FloatSerializer();
class BooleanSerializer {
    serialize(value) {
        return (!!value).toString();
    }
}
let booleanSerializer = new BooleanSerializer();
class StringSerializer {
    serialize(value) {
        return String(value);
    }
}
let stringSerializer = new StringSerializer();

const XSD = {
    namespace: "http://www.w3.org/2001/XMLSchema#",
    boolean: "http://www.w3.org/2001/XMLSchema#boolean",
    byte: "http://www.w3.org/2001/XMLSchema#byte",
    date: "http://www.w3.org/2001/XMLSchema#date",
    dateTime: "http://www.w3.org/2001/XMLSchema#dateTime",
    decimal: "http://www.w3.org/2001/XMLSchema#decimal",
    double: "http://www.w3.org/2001/XMLSchema#double",
    duration: "http://www.w3.org/2001/XMLSchema#duration",
    float: "http://www.w3.org/2001/XMLSchema#float",
    gDay: "http://www.w3.org/2001/XMLSchema#gDay",
    gMonth: "http://www.w3.org/2001/XMLSchema#gMonth",
    gMonthDay: "http://www.w3.org/2001/XMLSchema#gMonthDay",
    gYear: "http://www.w3.org/2001/XMLSchema#gYear",
    gYearMonth: "http://www.w3.org/2001/XMLSchema#gYearMonth",
    int: "http://www.w3.org/2001/XMLSchema#int",
    integer: "http://www.w3.org/2001/XMLSchema#integer",
    long: "http://www.w3.org/2001/XMLSchema#long",
    negativeInteger: "http://www.w3.org/2001/XMLSchema#negativeInteger",
    nonNegativeInteger: "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    nonPositiveInteger: "http://www.w3.org/2001/XMLSchema#nonPositiveInteger",
    object: "http://www.w3.org/2001/XMLSchema#object",
    positiveInteger: "http://www.w3.org/2001/XMLSchema#positiveInteger",
    short: "http://www.w3.org/2001/XMLSchema#short",
    string: "http://www.w3.org/2001/XMLSchema#string",
    time: "http://www.w3.org/2001/XMLSchema#time",
    unsignedByte: "http://www.w3.org/2001/XMLSchema#unsignedByte",
    unsignedInt: "http://www.w3.org/2001/XMLSchema#unsignedInt",
    unsignedLong: "http://www.w3.org/2001/XMLSchema#unsignedLong",
    unsignedShort: "http://www.w3.org/2001/XMLSchema#unsignedShort",
};



const index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DateSerializer: DateSerializer,
    dateSerializer: dateSerializer,
    DateTimeSerializer: DateTimeSerializer,
    dateTimeSerializer: dateTimeSerializer,
    TimeSerializer: TimeSerializer,
    timeSerializer: timeSerializer,
    IntegerSerializer: IntegerSerializer,
    integerSerializer: integerSerializer,
    LongSerializer: LongSerializer,
    longSerializer: longSerializer,
    UnsignedIntegerSerializer: UnsignedIntegerSerializer,
    unsignedIntegerSerializer: unsignedIntegerSerializer,
    UnsignedLongSerializer: UnsignedLongSerializer,
    unsignedLongSerializer: unsignedLongSerializer,
    FloatSerializer: FloatSerializer,
    floatSerializer: floatSerializer,
    BooleanSerializer: BooleanSerializer,
    booleanSerializer: booleanSerializer,
    StringSerializer: StringSerializer,
    stringSerializer: stringSerializer
});

const RDFLiteral = {
    from(value) {
        if (isNull(value))
            throw new IllegalArgumentError("Null cannot be converted into a Literal");
        if (!isDefined(value))
            throw new IllegalArgumentError("The value is undefined");
        let type;
        switch (true) {
            case isDate(value):
                type = XSD.dateTime;
                value = value.toISOString();
                break;
            case isNumber(value):
                if (isInteger(value)) {
                    type = XSD.integer;
                }
                else {
                    type = XSD.double;
                }
                break;
            case isString(value):
                type = XSD.string;
                break;
            case isBoolean(value):
                type = XSD.boolean;
                break;
            default:
                type = XSD.object;
                value = JSON.stringify(value);
                break;
        }
        let literal = { "@value": value.toString() };
        if (type)
            literal["@type"] = type;
        return literal;
    },
    parse(valueOrLiteral, type) {
        let literalValue;
        if (isString(valueOrLiteral)) {
            literalValue = valueOrLiteral;
        }
        else {
            let literal = valueOrLiteral;
            if (!literal)
                return null;
            if (!hasProperty(literal, "@value"))
                return null;
            type = "@type" in literal ? literal["@type"] : null;
            literalValue = literal["@value"];
        }
        let value = literalValue;
        switch (type) {
            case XSD.date:
            case XSD.dateTime:
                value = new Date(literalValue);
                break;
            case XSD.time:
                const parts = literalValue.match(/(\d+):(\d+):(\d+)\.(\d+)Z/);
                if (!parts)
                    throw new IllegalArgumentError(`Invalid value for type ${XSD.time}.`);
                value = new Date();
                value.setUTCHours(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4]));
                break;
            case XSD.duration:
                break;
            case XSD.gDay:
            case XSD.gMonth:
            case XSD.gMonthDay:
            case XSD.gYear:
            case XSD.gYearMonth:
                break;
            case XSD.byte:
            case XSD.decimal:
            case XSD.int:
            case XSD.integer:
            case XSD.long:
            case XSD.negativeInteger:
            case XSD.nonNegativeInteger:
            case XSD.nonPositiveInteger:
            case XSD.positiveInteger:
            case XSD.short:
            case XSD.unsignedLong:
            case XSD.unsignedInt:
            case XSD.unsignedShort:
            case XSD.unsignedByte:
            case XSD.double:
            case XSD.float:
                value = parseFloat(literalValue);
                break;
            case XSD.boolean:
                value = parseBoolean(literalValue);
                break;
            case XSD.string:
                value = literalValue;
                break;
            case XSD.object:
                value = JSON.parse(literalValue);
                break;
            default:
                break;
        }
        return value;
    },
    is(value) {
        return hasProperty(value, "@value")
            && isString(value["@value"]);
    },
    hasType(value, type) {
        if (!value["@type"] && type === XSD.string)
            return true;
        return value["@type"] === type;
    },
};

const RDFNode = {
    is(value) {
        return hasProperty(value, "@id")
            && isString(value["@id"]);
    },
    create(uri) {
        return {
            "@id": uri,
        };
    },
    getID(node) {
        return node["@id"];
    },
    getRelativeID(node) {
        const id = RDFNode.getID(node);
        return URI.hasFragment(id) ? URI.getFragment(id) : id;
    },
    areEqual(node1, node2) {
        return RDFNode.getID(node1) === RDFNode.getID(node2);
    },
    isFragment(node) {
        const id = RDFNode.getID(node);
        return URI.hasFragment(id) || URI.isBNodeID(id);
    },
    hasType(node, type) {
        return RDFNode.getTypes(node).indexOf(type) !== -1;
    },
    getTypes(node) {
        if (!("@type" in node))
            return [];
        return node["@type"];
    },
    getList(propertyValues) {
        if (!Array.isArray(propertyValues))
            return;
        return propertyValues
            .find(RDFList.is);
    },
    getPropertyLiterals(propertyValues, literalType) {
        if (!Array.isArray(propertyValues))
            return;
        return propertyValues
            .filter(RDFLiteral.is)
            .filter(literal => RDFLiteral.hasType(literal, literalType))
            .map(RDFLiteral.parse);
    },
    getPropertyLanguageMap(propertyValues) {
        if (!Array.isArray(propertyValues))
            return;
        const propertyLanguageMap = {};
        for (const propertyValue of propertyValues) {
            if (!RDFLiteral.is(propertyValue))
                continue;
            if (!RDFLiteral.hasType(propertyValue, XSD.string))
                continue;
            const languageTag = propertyValue["@language"];
            if (!languageTag)
                continue;
            propertyLanguageMap[languageTag] = RDFLiteral.parse(propertyValue);
        }
        return propertyLanguageMap;
    },
};

const RDFValue = {
    parse(pointerLibrary, value) {
        if (isString(value))
            return value;
        if (RDFLiteral.is(value))
            return RDFLiteral.parse(value);
        if (RDFNode.is(value))
            return _getPointer(pointerLibrary, value["@id"]);
        if (RDFList.is(value))
            return value["@list"]
                .map(RDFValue.parse.bind(null, pointerLibrary));
        return null;
    },
};

function _guessXSDType(value) {
    if (isFunction(value))
        return null;
    if (isString(value))
        return XSD.string;
    if (isDate(value))
        return XSD.dateTime;
    if (isNumber(value))
        return XSD.float;
    if (isBoolean(value))
        return XSD.boolean;
    return null;
}

class JSONLDConverter {
    get literalSerializers() { return this._literalSerializers; }
    static getDefaultSerializers() {
        let literalSerializers = new Map();
        literalSerializers.set(XSD.date, dateSerializer);
        literalSerializers.set(XSD.dateTime, dateTimeSerializer);
        literalSerializers.set(XSD.time, timeSerializer);
        literalSerializers.set(XSD.integer, integerSerializer);
        literalSerializers.set(XSD.int, integerSerializer);
        literalSerializers.set(XSD.unsignedInt, unsignedIntegerSerializer);
        literalSerializers.set(XSD.long, longSerializer);
        literalSerializers.set(XSD.unsignedLong, unsignedLongSerializer);
        literalSerializers.set(XSD.float, floatSerializer);
        literalSerializers.set(XSD.double, floatSerializer);
        literalSerializers.set(XSD.boolean, booleanSerializer);
        literalSerializers.set(XSD.string, stringSerializer);
        return literalSerializers;
    }
    constructor(literalSerializers) {
        this._literalSerializers = literalSerializers ?
            MapUtils.extend(new Map(), literalSerializers) :
            JSONLDConverter.getDefaultSerializers();
    }
    compact(expandedObjectOrObjects, targetObjectOrObjectsOrDigestedContext, digestedSchemaOrPointerLibrary, pointerLibrary, strict) {
        let targetObjectOrObjects = !pointerLibrary ? null : targetObjectOrObjectsOrDigestedContext;
        let digestedSchema = !pointerLibrary ? targetObjectOrObjectsOrDigestedContext : digestedSchemaOrPointerLibrary;
        pointerLibrary = !pointerLibrary ? digestedSchemaOrPointerLibrary : pointerLibrary;
        if (!Array.isArray(expandedObjectOrObjects))
            return this.__compactSingle(expandedObjectOrObjects, targetObjectOrObjects, digestedSchema, pointerLibrary, strict);
        let expandedObjects = expandedObjectOrObjects;
        let targetObjects = !!targetObjectOrObjects ? targetObjectOrObjects : [];
        for (let i = 0, length = expandedObjects.length; i < length; i++) {
            let expandedObject = expandedObjects[i];
            let targetObject = targetObjects[i] = !!targetObjects[i] ? targetObjects[i] : {};
            this.__compactSingle(expandedObject, targetObject, digestedSchema, pointerLibrary, strict);
        }
        return targetObjects;
    }
    expand(compactedObjectOrObjects, generalSchema, digestedSchema) {
        if (!Array.isArray(compactedObjectOrObjects))
            return this.__expandSingle(compactedObjectOrObjects, generalSchema, digestedSchema);
    }
    update(target, node, digestedSchema, pointerLibrary, strict) {
        const compactedData = this.compact(node, {}, digestedSchema, pointerLibrary, strict);
        new Set([
            ...Object.getOwnPropertyNames(target),
            ...Object.keys(compactedData),
        ]).forEach(key => {
            if (key.startsWith("$"))
                return;
            if (isFunction(target[key]))
                return;
            if (!compactedData.hasOwnProperty(key)) {
                if (!strict || digestedSchema.properties.has(key))
                    delete target[key];
                return;
            }
            if (!Array.isArray(target[key])) {
                target[key] = compactedData[key];
                return;
            }
            const values = Array.isArray(compactedData[key]) ? compactedData[key] : [compactedData[key]];
            target[key].length = 0;
            target[key].push(...values);
        });
    }
    __expandSingle(compactedObject, generalSchema, digestedSchema) {
        let expandedObject = {};
        expandedObject["@id"] = !!compactedObject["$id"] ? compactedObject["$id"] : "";
        if (compactedObject["types"]) {
            const types = Array.isArray(compactedObject["types"]) ?
                compactedObject["types"] : [compactedObject["types"]];
            if (types.length)
                expandedObject["@type"] = types
                    .map(type => generalSchema.resolveURI(type, { vocab: true, base: true }));
        }
        for (const propertyName of Object.keys(compactedObject)) {
            if (propertyName === "$id")
                continue;
            if (propertyName === "types")
                continue;
            const expandedPropertyName = digestedSchema.resolveURI(propertyName, { vocab: true });
            if (URI.isRelative(expandedPropertyName))
                continue;
            const expandedValue = this.__expandProperty(propertyName, compactedObject[propertyName], digestedSchema, generalSchema);
            if (expandedValue === null)
                continue;
            expandedObject[expandedPropertyName] = expandedValue;
        }
        return expandedObject;
    }
    __expandProperty(propertyName, propertyValue, digestedSchema, generalSchema) {
        const definition = digestedSchema.properties.get(propertyName);
        const propertyContainer = definition ? definition.containerType : void 0;
        if (propertyContainer === ContainerType.LANGUAGE)
            return this.__expandPropertyLanguageMap(propertyValue);
        propertyValue = Array.isArray(propertyValue) ? propertyValue : [propertyValue];
        if (propertyContainer === null)
            propertyValue = [propertyValue[0]];
        const propertyType = definition ? definition.literal : null;
        const expandedValues = propertyType === true ?
            this.__expandPropertyLiteral(propertyValue, definition, digestedSchema) :
            propertyType === false ?
                this.__expandPropertyPointer(propertyValue, digestedSchema, generalSchema) :
                this.__expandPropertyValue(propertyValue, digestedSchema, generalSchema);
        const filteredValues = expandedValues.filter(value => value !== null);
        if (!filteredValues.length)
            return null;
        if (propertyContainer === ContainerType.LIST)
            return [
                { "@list": filteredValues },
            ];
        return filteredValues;
    }
    __expandPropertyValue(propertyValue, digestedSchema, generalSchema) {
        return propertyValue.map(value => this.__expandValue(value, digestedSchema, generalSchema));
    }
    __expandPropertyPointer(propertyValue, digestedSchema, generalSchema) {
        return propertyValue.map(value => this.__expandPointerValue(value, digestedSchema, generalSchema));
    }
    __expandPropertyLiteral(propertyValue, definition, digestedSchema) {
        const literalType = digestedSchema.resolveURI(definition.literalType, { vocab: true, base: true });
        const expandedValues = propertyValue.map(value => this.__expandLiteralValue(value, literalType));
        if (definition.language)
            expandedValues.forEach(value => value["@language"] = definition.language);
        return expandedValues;
    }
    __expandPropertyLanguageMap(propertyValue) {
        if (!isObject(propertyValue)) {
            return null;
        }
        let mapValues = [];
        for (const languageTag of Object.keys(propertyValue)) {
            let serializedValue = this.literalSerializers.get(XSD.string).serialize(propertyValue[languageTag]);
            mapValues.push({ "@value": serializedValue, "@type": XSD.string, "@language": languageTag });
        }
        return mapValues;
    }
    __expandPointerValue(propertyValue, digestedSchema, generalSchema) {
        const isStringID = isString(propertyValue);
        const id = Pointer.is(propertyValue) ?
            propertyValue.$id :
            isStringID ?
                propertyValue :
                null;
        if (!id)
            return null;
        const resolved = generalSchema.resolveURI(id, { vocab: isStringID });
        return { "@id": resolved };
    }
    __expandValue(propertyValue, digestedSchema, generalSchema) {
        if (Array.isArray(propertyValue))
            return null;
        return Pointer.is(propertyValue) ?
            this.__expandPointerValue(propertyValue, generalSchema, digestedSchema) :
            this.__expandLiteralValue(propertyValue, _guessXSDType(propertyValue));
    }
    __expandLiteralValue(literalValue, literalType) {
        if (literalType === null)
            return null;
        if (!this.literalSerializers.has(literalType))
            return null;
        const serializedValue = this.literalSerializers
            .get(literalType)
            .serialize(literalValue);
        return { "@value": serializedValue, "@type": literalType };
    }
    __compactSingle(expandedObject, targetObject, digestedSchema, pointerLibrary, strict) {
        if (!expandedObject["@id"])
            throw new IllegalArgumentError("The expandedObject doesn't have an @id defined.");
        targetObject["$id"] = expandedObject["@id"];
        targetObject["types"] = !!expandedObject["@type"] ? expandedObject["@type"] : [];
        const propertyURINameMap = this.__getPropertyURINameMap(digestedSchema);
        for (const propertyURI of Object.keys(expandedObject)) {
            if (propertyURI === "@id")
                continue;
            if (propertyURI === "@type")
                continue;
            const propertyValues = expandedObject[propertyURI];
            if (!_isExistingValue(propertyValues))
                continue;
            if (!propertyURINameMap.has(propertyURI) && strict)
                continue;
            const propertyName = propertyURINameMap.has(propertyURI) ?
                propertyURINameMap.get(propertyURI) :
                digestedSchema.vocab ?
                    URI.getRelativeURI(propertyURI, digestedSchema.vocab) :
                    propertyURI;
            const targetValue = this.__getPropertyValue(propertyName, propertyValues, digestedSchema, pointerLibrary);
            if (targetValue === null || targetValue === void 0)
                continue;
            targetObject[propertyName] = targetValue;
        }
        return targetObject;
    }
    __getPropertyContainerType(propertyValues) {
        if (propertyValues.length === 1) {
            if (RDFList.is(propertyValues[0]))
                return ContainerType.LIST;
        }
        else {
            return ContainerType.SET;
        }
        return null;
    }
    __getPropertyValue(propertyName, propertyValues, digestedSchema, pointerLibrary) {
        const definition = digestedSchema.properties.get(propertyName);
        const propertyContainer = definition ?
            definition.containerType :
            this.__getPropertyContainerType(propertyValues);
        if (propertyContainer === ContainerType.LANGUAGE) {
            return RDFNode.getPropertyLanguageMap(propertyValues);
        }
        if (propertyContainer === ContainerType.LIST) {
            const list = RDFNode.getList(propertyValues);
            if (!list)
                return null;
            propertyValues = list["@list"];
        }
        const propertyType = definition ? definition.literal : null;
        if (propertyType === true && (definition && definition.language)) {
            propertyValues = propertyValues.filter(value => value["@language"] === definition.language);
        }
        if (propertyContainer === null)
            propertyValues = [propertyValues[0]];
        const compactedValues = propertyType === true ?
            this.__compactPropertyLiteral(propertyValues, definition, digestedSchema) :
            propertyType === false ?
                this.__getPropertyPointers(propertyValues, pointerLibrary) :
                this.__getProperties(propertyValues, pointerLibrary);
        if (!compactedValues)
            return null;
        const filteredValues = compactedValues.filter(value => value !== null);
        if (!filteredValues.length)
            return null;
        if (propertyContainer === null)
            return filteredValues[0];
        return filteredValues;
    }
    __getPropertyURINameMap(digestedSchema) {
        const map = new Map();
        digestedSchema.properties.forEach((definition, propertyName) => {
            const uri = digestedSchema.resolveURI(definition.uri, { vocab: true });
            map.set(uri, propertyName);
        });
        return map;
    }
    __compactPropertyLiteral(propertyValues, definition, digestedSchema) {
        const literalType = definition.literalType === null ?
            XSD.string : digestedSchema.resolveURI(definition.literalType, { vocab: true, base: true });
        return RDFNode.getPropertyLiterals(propertyValues, literalType);
    }
    __getProperties(propertyValues, pointerLibrary) {
        if (!Array.isArray(propertyValues))
            return;
        return propertyValues
            .map(RDFValue.parse.bind(null, pointerLibrary))
            .filter(value => !isNull(value));
    }
    __getPropertyPointers(propertyValues, pointerLibrary) {
        if (!Array.isArray(propertyValues))
            return;
        return propertyValues
            .filter(RDFNode.is)
            .map(RDFNode.getID)
            .map(_getPointer.bind(null, pointerLibrary))
            .filter(pointer => !isNull(pointer));
    }
}

class DigestedObjectSchemaProperty {
    constructor() {
        this.uri = null;
        this.literal = null;
        this.literalType = null;
        this.pointerType = null;
        this.containerType = null;
    }
}

class ObjectSchemaUtils {
    static _resolveProperty(schema, definition, inSame) {
        const uri = definition.uri;
        const type = definition.literalType;
        const resolvedURI = schema.resolveURI(uri, { vocab: true });
        const resolvedType = schema.resolveURI(type, { vocab: true, base: true });
        if (resolvedURI !== uri || resolvedType !== type) {
            if (!inSame) {
                definition = Object
                    .assign(new DigestedObjectSchemaProperty(), definition);
            }
            definition.uri = resolvedURI;
            definition.literalType = resolvedType;
        }
        return definition;
    }
}

class DigestedObjectSchema {
    constructor() {
        this.base = "";
        this.vocab = undefined;
        this.language = null;
        this.prefixes = new Map();
        this.properties = new Map();
    }
    resolveURI(uri, relativeTo = {}) {
        if (uri === null || URI.isAbsolute(uri) || URI.isBNodeID(uri))
            return uri;
        const [prefix, localName = ""] = uri.split(":");
        const definedReference = this.prefixes.has(prefix) ?
            this.prefixes.get(prefix) : this.properties.has(prefix) ?
            this.properties.get(prefix).uri
            : null;
        if (definedReference !== null && definedReference !== prefix) {
            return this.resolveURI(definedReference + localName, { vocab: true });
        }
        if (localName)
            return uri;
        if (relativeTo.vocab && this.vocab)
            return this.vocab + uri;
        if (relativeTo.base)
            return URI.resolve(this.base, uri);
        return uri;
    }
    getProperty(name) {
        if (!this.properties.has(name))
            return void 0;
        return ObjectSchemaUtils._resolveProperty(this, this.properties.get(name));
    }
}

const RegisteredPointer = {
    PROTOTYPE: {
        get $registry() {
            throw new IllegalArgumentError(`Property "$registry" is required.`);
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(RegisteredPointer.PROTOTYPE, object);
    },
    decorate(object) {
        if (RegisteredPointer.isDecorated(object))
            return object;
        const resource = ModelDecorator
            .decorateMultiple(object, Pointer);
        return ModelDecorator
            .definePropertiesFrom(RegisteredPointer.PROTOTYPE, resource);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return RegisteredPointer.createFrom(copy);
    },
    createFrom(object) {
        return RegisteredPointer.decorate(object);
    },
    is(value) {
        return Pointer.is(value)
            && RegisteredPointer.isDecorated(value);
    },
};

function __getContext(registry) {
    if (!registry)
        return;
    if ("context" in registry && registry.context)
        return registry.context;
    return __getContext("$id" in registry ? registry.$registry : registry.registry);
}
function __resolveURI(resource, uri) {
    if (URI.isAbsolute(uri))
        return uri;
    const context = __getContext(resource.$registry);
    if (!context)
        return uri;
    return context
        .getObjectSchema()
        .resolveURI(uri, { vocab: true });
}
const Resource = {
    PROTOTYPE: {
        get types() { return []; },
        get $slug() {
            if (URI.isBNodeID(this.$id))
                return this.$id;
            return URI.getSlug(this.$id);
        },
        set $slug(slug) { },
        $addType(type) {
            type = __resolveURI(this, type);
            if (this.types.indexOf(type) !== -1)
                return;
            this.types.push(type);
        },
        $hasType(type) {
            type = __resolveURI(this, type);
            return this.types.indexOf(type) !== -1;
        },
        $removeType(type) {
            type = __resolveURI(this, type);
            const index = this.types.indexOf(type);
            if (index !== -1)
                this.types.splice(index, 1);
        },
        toJSON(contextOrKey) {
            const context = typeof contextOrKey === "object" ?
                contextOrKey : __getContext(this.$registry);
            const generalSchema = context ?
                context.registry.getGeneralSchema() : new DigestedObjectSchema();
            const resourceSchema = context && context.registry ?
                context.registry.getSchemaFor(this) : generalSchema;
            const jsonldConverter = context ?
                context.jsonldConverter : new JSONLDConverter();
            return jsonldConverter.expand(this, generalSchema, resourceSchema);
        },
    },
    isDecorated(object) {
        return isObject(object)
            && ModelDecorator
                .hasPropertiesFrom(Resource.PROTOTYPE, object);
    },
    is(value) {
        return Pointer.is(value)
            && Resource.isDecorated(value);
    },
    create(data) {
        const clone = Object.assign({}, data);
        return Resource.createFrom(clone);
    },
    createFrom(object) {
        return Resource.decorate(object);
    },
    decorate(object) {
        if (Resource.isDecorated(object))
            return object;
        if (!object.hasOwnProperty("$registry"))
            object.$registry = void 0;
        const resource = ModelDecorator
            .decorateMultiple(object, RegisteredPointer);
        return ModelDecorator
            .definePropertiesFrom(Resource.PROTOTYPE, resource);
    },
};

const FreeResources = {
    PROTOTYPE: {
        _getLocalID(id) {
            if (isAbsolute(id) && !URI.hasProtocol(id))
                return id;
            throw new IllegalArgumentError(`"${id}" is out of scope.`);
        },
        _addPointer(base) {
            if (!base.$id)
                base.$id = URI.generateBNodeID();
            return Registry.PROTOTYPE._addPointer.call(this, base);
        },
        toJSON(contextOrKey) {
            return this
                .getPointers(true)
                .map(resource => resource.toJSON(contextOrKey));
        },
    },
    is(value) {
        return Registry.isDecorated(value)
            && FreeResources.isDecorated(value);
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(FreeResources.PROTOTYPE, object);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return FreeResources.createFrom(copy);
    },
    createFrom(object) {
        return FreeResources.decorate(object);
    },
    decorate(object) {
        if (FreeResources.isDecorated(object))
            return object;
        const base = Object.assign(object, {
            __modelDecorator: Resource,
        });
        const resource = ModelDecorator
            .decorateMultiple(base, Registry);
        return ModelDecorator
            .definePropertiesFrom(FreeResources.PROTOTYPE, resource);
    },
    parseFreeNodes(registry, freeNodes) {
        const freeResources = FreeResources
            .createFrom({ registry: registry });
        freeNodes
            .forEach(node => {
            const digestedSchema = registry.getSchemaFor(node);
            const target = freeResources.getPointer(node["@id"], true);
            registry.context.jsonldConverter.compact(node, target, digestedSchema, freeResources);
        });
        return freeResources;
    },
};

class JSONParser {
    parse(body) {
        return new Promise(resolve => resolve(JSON.parse(body)));
    }
}

class InvalidJSONLDSyntaxError extends AbstractError {
    get name() { return "InvalidJSONLDSyntaxError"; }
}

class NotImplementedError extends AbstractError {
    get name() { return "NotImplementedError"; }
    constructor(message = "") {
        super(message);
    }
}

const global$1 = (typeof global !== "undefined" ? global :
  typeof self !== "undefined" ? self :
  typeof window !== "undefined" ? window : {});

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray$1 = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
var _kMaxLength = kMaxLength();

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray$1(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length)
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray$1(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var browser$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var hasFetch = isFunction$1(global$1.fetch) && isFunction$1(global$1.ReadableStream);

var _blobConstructor;
function blobConstructor() {
  if (typeof _blobConstructor !== 'undefined') {
    return _blobConstructor;
  }
  try {
    new global$1.Blob([new ArrayBuffer(1)]);
    _blobConstructor = true;
  } catch (e) {
    _blobConstructor = false;
  }
  return _blobConstructor
}
var xhr;

function checkTypeSupport(type) {
  if (!xhr) {
    xhr = new global$1.XMLHttpRequest();
    // If location.host is empty, e.g. if this page/worker was loaded
    // from a Blob, then use example.com to avoid an error
    xhr.open('GET', global$1.location.host ? '/' : 'https://example.com');
  }
  try {
    xhr.responseType = type;
    return xhr.responseType === type
  } catch (e) {
    return false
  }

}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global$1.ArrayBuffer !== 'undefined';
var haveSlice = haveArrayBuffer && isFunction$1(global$1.ArrayBuffer.prototype.slice);

var arraybuffer = haveArrayBuffer && checkTypeSupport('arraybuffer');
  // These next two tests unavoidably show warnings in Chrome. Since fetch will always
  // be used if it's available, just return false for these to avoid the warnings.
var msstream = !hasFetch && haveSlice && checkTypeSupport('ms-stream');
var mozchunkedarraybuffer = !hasFetch && haveArrayBuffer &&
  checkTypeSupport('moz-chunked-arraybuffer');
var overrideMimeType = isFunction$1(xhr.overrideMimeType);
var vbArray = isFunction$1(global$1.VBArray);

function isFunction$1(value) {
  return typeof value === 'function'
}

xhr = null; // Help gc

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
const inherits$1 = inherits;

var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString$1(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull$1(x) || !isObject$1(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global$1.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (browser$1.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (browser$1.throwDeprecation) {
        throw new Error(msg);
      } else if (browser$1.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = browser$1.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean$1(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction$2(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString$1(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction$2(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate$1(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray$2(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction$2(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate$1(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString$1(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber$1(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean$1(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull$1(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull$1(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray$2(ar) {
  return Array.isArray(ar);
}

function isBoolean$1(arg) {
  return typeof arg === 'boolean';
}

function isNull$1(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isNumber$1(arg) {
  return typeof arg === 'number';
}

function isString$1(arg) {
  return typeof arg === 'string';
}

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject$1(re) && objectToString(re) === '[object RegExp]';
}

function isObject$1(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate$1(d) {
  return isObject$1(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject$1(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction$2(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function isBuffer$1(maybeBuf) {
  return Buffer.isBuffer(maybeBuf);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad$1(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad$1(d.getHours()),
              pad$1(d.getMinutes()),
              pad$1(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
function log() {
  console.log('%s - %s', timestamp(), format.apply(null, arguments));
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject$1(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

const util = {
  inherits: inherits$1,
  _extend: _extend,
  log: log,
  isBuffer: isBuffer$1,
  isPrimitive: isPrimitive,
  isFunction: isFunction$2,
  isError: isError,
  isDate: isDate$1,
  isObject: isObject$1,
  isRegExp: isRegExp,
  isUndefined: isUndefined,
  isSymbol: isSymbol,
  isString: isString$1,
  isNumber: isNumber$1,
  isNullOrUndefined: isNullOrUndefined,
  isNull: isNull$1,
  isBoolean: isBoolean$1,
  isArray: isArray$2,
  inspect: inspect,
  deprecate: deprecate,
  format: format,
  debuglog: debuglog
};

'use strict';

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) {
      this.domain = domain.active;
    }
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var needDomainExit = false;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  if (needDomainExit)
    domain.exit();

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return Buffer.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = Buffer.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};

// Copyright Joyent, Inc. and other Node contributors.
var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     };


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
function StringDecoder(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

'use strict';


Readable.ReadableState = ReadableState;

var debug = debuglog('stream');
inherits$1(Readable, EventEmitter);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (Array.isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
}
function listenerCount$1 (emitter, type) {
  return emitter.listeners(type).length;
}
function ReadableState(options, stream) {

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  EventEmitter.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = Buffer.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false);

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (listenerCount$1(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && src.listeners('data').length) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var _i = 0; _i < len; _i++) {
      dests[_i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1) return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = EventEmitter.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

// A bit simpler than readable streams.
Writable.WritableState = WritableState;
inherits$1(Writable, EventEmitter);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Object.defineProperty(this, 'buffer', {
    get: deprecate(function () {
      return this.getBuffer();
    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
  });
  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};
function Writable(options) {

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  EventEmitter.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  nextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) nextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
        nextTick(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}

inherits$1(Duplex, Readable);

var keys = Object.keys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}
function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

// a transform stream is a readable/writable stream where you do
inherits$1(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er) {
      done(stream, er);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('Not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er) {
  if (er) return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

inherits$1(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

inherits$1(Stream, EventEmitter);
Stream.Readable = Readable;
Stream.Writable = Writable;
Stream.Duplex = Duplex;
Stream.Transform = Transform;
Stream.PassThrough = PassThrough;

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EventEmitter.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EventEmitter.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

var rStates = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};
function IncomingMessage(xhr, response, mode) {
  var self = this;
  Readable.call(self);

  self._mode = mode;
  self.headers = {};
  self.rawHeaders = [];
  self.trailers = {};
  self.rawTrailers = [];

  // Fake the 'close' event, but only once 'end' fires
  self.on('end', function() {
    // The nextTick is necessary to prevent the 'request' module from causing an infinite loop
    browser$1.nextTick(function() {
      self.emit('close');
    });
  });
  var read;
  if (mode === 'fetch') {
    self._fetchResponse = response;

    self.url = response.url;
    self.statusCode = response.status;
    self.statusMessage = response.statusText;
      // backwards compatible version of for (<item> of <iterable>):
      // for (var <item>,_i,_it = <iterable>[Symbol.iterator](); <item> = (_i = _it.next()).value,!_i.done;)
    for (var header, _i, _it = response.headers[Symbol.iterator](); header = (_i = _it.next()).value, !_i.done;) {
      self.headers[header[0].toLowerCase()] = header[1];
      self.rawHeaders.push(header[0], header[1]);
    }

    // TODO: this doesn't respect backpressure. Once WritableStream is available, this can be fixed
    var reader = response.body.getReader();

    read = function () {
      reader.read().then(function(result) {
        if (self._destroyed)
          return
        if (result.done) {
          self.push(null);
          return
        }
        self.push(new Buffer(result.value));
        read();
      });
    };
    read();

  } else {
    self._xhr = xhr;
    self._pos = 0;

    self.url = xhr.responseURL;
    self.statusCode = xhr.status;
    self.statusMessage = xhr.statusText;
    var headers = xhr.getAllResponseHeaders().split(/\r?\n/);
    headers.forEach(function(header) {
      var matches = header.match(/^([^:]+):\s*(.*)/);
      if (matches) {
        var key = matches[1].toLowerCase();
        if (key === 'set-cookie') {
          if (self.headers[key] === undefined) {
            self.headers[key] = [];
          }
          self.headers[key].push(matches[2]);
        } else if (self.headers[key] !== undefined) {
          self.headers[key] += ', ' + matches[2];
        } else {
          self.headers[key] = matches[2];
        }
        self.rawHeaders.push(matches[1], matches[2]);
      }
    });

    self._charset = 'x-user-defined';
    if (!overrideMimeType) {
      var mimeType = self.rawHeaders['mime-type'];
      if (mimeType) {
        var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/);
        if (charsetMatch) {
          self._charset = charsetMatch[1].toLowerCase();
        }
      }
      if (!self._charset)
        self._charset = 'utf-8'; // best guess
    }
  }
}

inherits$1(IncomingMessage, Readable);

IncomingMessage.prototype._read = function() {};

IncomingMessage.prototype._onXHRProgress = function() {
  var self = this;

  var xhr = self._xhr;

  var response = null;
  switch (self._mode) {
  case 'text:vbarray': // For IE9
    if (xhr.readyState !== rStates.DONE)
      break
    try {
      // This fails in IE8
      response = new global$1.VBArray(xhr.responseBody).toArray();
    } catch (e) {
      // pass
    }
    if (response !== null) {
      self.push(new Buffer(response));
      break
    }
    // Falls through in IE8
  case 'text':
    try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
      response = xhr.responseText;
    } catch (e) {
      self._mode = 'text:vbarray';
      break
    }
    if (response.length > self._pos) {
      var newData = response.substr(self._pos);
      if (self._charset === 'x-user-defined') {
        var buffer = new Buffer(newData.length);
        for (var i = 0; i < newData.length; i++)
          buffer[i] = newData.charCodeAt(i) & 0xff;

        self.push(buffer);
      } else {
        self.push(newData, self._charset);
      }
      self._pos = response.length;
    }
    break
  case 'arraybuffer':
    if (xhr.readyState !== rStates.DONE || !xhr.response)
      break
    response = xhr.response;
    self.push(new Buffer(new Uint8Array(response)));
    break
  case 'moz-chunked-arraybuffer': // take whole
    response = xhr.response;
    if (xhr.readyState !== rStates.LOADING || !response)
      break
    self.push(new Buffer(new Uint8Array(response)));
    break
  case 'ms-stream':
    response = xhr.response;
    if (xhr.readyState !== rStates.LOADING)
      break
    var reader = new global$1.MSStreamReader();
    reader.onprogress = function() {
      if (reader.result.byteLength > self._pos) {
        self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))));
        self._pos = reader.result.byteLength;
      }
    };
    reader.onload = function() {
      self.push(null);
    };
      // reader.onerror = ??? // TODO: this
    reader.readAsArrayBuffer(response);
    break
  }

  // The ms-stream case handles end separately in reader.onload()
  if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
    self.push(null);
  }
};

// from https://github.com/jhiesey/to-arraybuffer/blob/6502d9850e70ba7935a7df4ad86b358fc216f9f0/index.js
function toArrayBuffer (buf) {
  // If the buffer is backed by a Uint8Array, a faster version will work
  if (buf instanceof Uint8Array) {
    // If the buffer isn't a subarray, return the underlying ArrayBuffer
    if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
      return buf.buffer
    } else if (typeof buf.buffer.slice === 'function') {
      // Otherwise we need to get a proper copy
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    }
  }

  if (isBuffer(buf)) {
    // This is the slow version that will work with any Buffer
    // implementation (even in old browsers)
    var arrayCopy = new Uint8Array(buf.length);
    var len = buf.length;
    for (var i = 0; i < len; i++) {
      arrayCopy[i] = buf[i];
    }
    return arrayCopy.buffer
  } else {
    throw new Error('Argument must be a Buffer')
  }
}

function decideMode(preferBinary, useFetch) {
  if (hasFetch && useFetch) {
    return 'fetch'
  } else if (mozchunkedarraybuffer) {
    return 'moz-chunked-arraybuffer'
  } else if (msstream) {
    return 'ms-stream'
  } else if (arraybuffer && preferBinary) {
    return 'arraybuffer'
  } else if (vbArray && preferBinary) {
    return 'text:vbarray'
  } else {
    return 'text'
  }
}

function ClientRequest(opts) {
  var self = this;
  Writable.call(self);

  self._opts = opts;
  self._body = [];
  self._headers = {};
  if (opts.auth)
    self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'));
  Object.keys(opts.headers).forEach(function(name) {
    self.setHeader(name, opts.headers[name]);
  });

  var preferBinary;
  var useFetch = true;
  if (opts.mode === 'disable-fetch') {
    // If the use of XHR should be preferred and includes preserving the 'content-type' header
    useFetch = false;
    preferBinary = true;
  } else if (opts.mode === 'prefer-streaming') {
    // If streaming is a high priority but binary compatibility and
    // the accuracy of the 'content-type' header aren't
    preferBinary = false;
  } else if (opts.mode === 'allow-wrong-content-type') {
    // If streaming is more important than preserving the 'content-type' header
    preferBinary = !overrideMimeType;
  } else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
    // Use binary if text streaming may corrupt data or the content-type header, or for speed
    preferBinary = true;
  } else {
    throw new Error('Invalid value for opts.mode')
  }
  self._mode = decideMode(preferBinary, useFetch);

  self.on('finish', function() {
    self._onFinish();
  });
}

inherits$1(ClientRequest, Writable);
// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'user-agent',
  'via'
];
ClientRequest.prototype.setHeader = function(name, value) {
  var self = this;
  var lowerName = name.toLowerCase();
    // This check is not necessary, but it prevents warnings from browsers about setting unsafe
    // headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
    // http-browserify did it, so I will too.
  if (unsafeHeaders.indexOf(lowerName) !== -1)
    return

  self._headers[lowerName] = {
    name: name,
    value: value
  };
};

ClientRequest.prototype.getHeader = function(name) {
  var self = this;
  return self._headers[name.toLowerCase()].value
};

ClientRequest.prototype.removeHeader = function(name) {
  var self = this;
  delete self._headers[name.toLowerCase()];
};

ClientRequest.prototype._onFinish = function() {
  var self = this;

  if (self._destroyed)
    return
  var opts = self._opts;

  var headersObj = self._headers;
  var body;
  if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
    if (blobConstructor()) {
      body = new global$1.Blob(self._body.map(function(buffer) {
        return toArrayBuffer(buffer)
      }), {
        type: (headersObj['content-type'] || {}).value || ''
      });
    } else {
      // get utf8 string
      body = Buffer.concat(self._body).toString();
    }
  }

  if (self._mode === 'fetch') {
    var headers = Object.keys(headersObj).map(function(name) {
      return [headersObj[name].name, headersObj[name].value]
    });

    global$1.fetch(self._opts.url, {
      method: self._opts.method,
      headers: headers,
      body: body,
      mode: 'cors',
      credentials: opts.withCredentials ? 'include' : 'same-origin'
    }).then(function(response) {
      self._fetchResponse = response;
      self._connect();
    }, function(reason) {
      self.emit('error', reason);
    });
  } else {
    var xhr = self._xhr = new global$1.XMLHttpRequest();
    try {
      xhr.open(self._opts.method, self._opts.url, true);
    } catch (err) {
      browser$1.nextTick(function() {
        self.emit('error', err);
      });
      return
    }

    // Can't set responseType on really old browsers
    if ('responseType' in xhr)
      xhr.responseType = self._mode.split(':')[0];

    if ('withCredentials' in xhr)
      xhr.withCredentials = !!opts.withCredentials;

    if (self._mode === 'text' && 'overrideMimeType' in xhr)
      xhr.overrideMimeType('text/plain; charset=x-user-defined');

    Object.keys(headersObj).forEach(function(name) {
      xhr.setRequestHeader(headersObj[name].name, headersObj[name].value);
    });

    self._response = null;
    xhr.onreadystatechange = function() {
      switch (xhr.readyState) {
      case rStates.LOADING:
      case rStates.DONE:
        self._onXHRProgress();
        break
      }
    };
      // Necessary for streaming in Firefox, since xhr.response is ONLY defined
      // in onprogress, not in onreadystatechange with xhr.readyState = 3
    if (self._mode === 'moz-chunked-arraybuffer') {
      xhr.onprogress = function() {
        self._onXHRProgress();
      };
    }

    xhr.onerror = function() {
      if (self._destroyed)
        return
      self.emit('error', new Error('XHR error'));
    };

    try {
      xhr.send(body);
    } catch (err) {
      browser$1.nextTick(function() {
        self.emit('error', err);
      });
      return
    }
  }
};

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid(xhr) {
  try {
    var status = xhr.status;
    return (status !== null && status !== 0)
  } catch (e) {
    return false
  }
}

ClientRequest.prototype._onXHRProgress = function() {
  var self = this;

  if (!statusValid(self._xhr) || self._destroyed)
    return

  if (!self._response)
    self._connect();

  self._response._onXHRProgress();
};

ClientRequest.prototype._connect = function() {
  var self = this;

  if (self._destroyed)
    return

  self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode);
  self.emit('response', self._response);
};

ClientRequest.prototype._write = function(chunk, encoding, cb) {
  var self = this;

  self._body.push(chunk);
  cb();
};

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function() {
  var self = this;
  self._destroyed = true;
  if (self._response)
    self._response._destroyed = true;
  if (self._xhr)
    self._xhr.abort();
    // Currently, there isn't a way to truly abort a fetch.
    // If you like bikeshedding, see https://github.com/whatwg/fetch/issues/27
};

ClientRequest.prototype.end = function(data, encoding, cb) {
  var self = this;
  if (typeof data === 'function') {
    cb = data;
    data = undefined;
  }

  Writable.prototype.end.call(self, data, encoding, cb);
};

ClientRequest.prototype.flushHeaders = function() {};
ClientRequest.prototype.setTimeout = function() {};
ClientRequest.prototype.setNoDelay = function() {};
ClientRequest.prototype.setSocketKeepAlive = function() {};

/*! https://mths.be/punycode v1.4.1 by @mathias */


/** Highest positive signed 32-bit float value */
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'

/** Regular expressions */
var regexPunycode = /^xn--/;
var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
var errors = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
  throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
  var length = array.length;
  var result = [];
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
  var parts = string.split('@');
  var result = '';
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E');
  var labels = string.split('.');
  var encoded = map(labels, fn).join('.');
  return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
  var output = [],
    counter = 0,
    length = string.length,
    value,
    extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
function ucs2encode(array) {
  return map(array, function(value) {
    var output = '';
    if (value > 0xFFFF) {
      value -= 0x10000;
      output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
      value = 0xDC00 | value & 0x3FF;
    }
    output += stringFromCharCode(value);
    return output;
  }).join('');
}

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
function basicToDigit(codePoint) {
  if (codePoint - 48 < 10) {
    return codePoint - 22;
  }
  if (codePoint - 65 < 26) {
    return codePoint - 65;
  }
  if (codePoint - 97 < 26) {
    return codePoint - 97;
  }
  return base;
}

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for ( /* no initialization */ ; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
}

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
function decode(input) {
  // Don't use UCS-2
  var output = [],
    inputLength = input.length,
    out,
    i = 0,
    n = initialN,
    bias = initialBias,
    basic,
    j,
    index,
    oldi,
    w,
    k,
    digit,
    t,
    /** Cached calculation results */
    baseMinusT;

  // Handle the basic code points: let `basic` be the number of input code
  // points before the last delimiter, or `0` if there is none, then copy
  // the first basic code points to the output.

  basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }

  for (j = 0; j < basic; ++j) {
    // if it's not a basic code point
    if (input.charCodeAt(j) >= 0x80) {
      error('not-basic');
    }
    output.push(input.charCodeAt(j));
  }

  // Main decoding loop: start just after the last delimiter if any basic code
  // points were copied; start at the beginning otherwise.

  for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */ ) {

    // `index` is the index of the next character to be consumed.
    // Decode a generalized variable-length integer into `delta`,
    // which gets added to `i`. The overflow checking is easier
    // if we increase `i` as we go, then subtract off its starting
    // value at the end to obtain `delta`.
    for (oldi = i, w = 1, k = base; /* no condition */ ; k += base) {

      if (index >= inputLength) {
        error('invalid-input');
      }

      digit = basicToDigit(input.charCodeAt(index++));

      if (digit >= base || digit > floor((maxInt - i) / w)) {
        error('overflow');
      }

      i += digit * w;
      t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

      if (digit < t) {
        break;
      }

      baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) {
        error('overflow');
      }

      w *= baseMinusT;

    }

    out = output.length + 1;
    bias = adapt(i - oldi, out, oldi == 0);

    // `i` was supposed to wrap around from `out` to `0`,
    // incrementing `n` each time, so we'll fix that now:
    if (floor(i / out) > maxInt - n) {
      error('overflow');
    }

    n += floor(i / out);
    i %= out;

    // Insert `n` at position `i` of the output
    output.splice(i++, 0, n);

  }

  return ucs2encode(output);
}

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(input) {
  var n,
    delta,
    handledCPCount,
    basicLength,
    bias,
    j,
    m,
    q,
    k,
    t,
    currentValue,
    output = [],
    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,
    /** Cached calculation results */
    handledCPCountPlusOne,
    baseMinusT,
    qMinusT;

  // Convert the input in UCS-2 to Unicode
  input = ucs2decode(input);

  // Cache the length
  inputLength = input.length;

  // Initialize the state
  n = initialN;
  delta = 0;
  bias = initialBias;

  // Handle the basic code points
  for (j = 0; j < inputLength; ++j) {
    currentValue = input[j];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  handledCPCount = basicLength = output.length;

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string - if it is not empty - with a delimiter
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {

    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    for (m = maxInt, j = 0; j < inputLength; ++j) {
      currentValue = input[j];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow
    handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < n && ++delta > maxInt) {
        error('overflow');
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer
        for (q = delta, k = base; /* no condition */ ; k += base) {
          t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) {
            break;
          }
          qMinusT = q - t;
          baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;

  }
  return output.join('');
}

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
function toUnicode(input) {
  return mapDomain(input, function(string) {
    return regexPunycode.test(string) ?
      decode(string.slice(4).toLowerCase()) :
      string;
  });
}

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ?
      'xn--' + encode(string) :
      string;
  });
}
var version$1 = '1.4.1';
/**
 * An object of methods to convert from JavaScript's internal character
 * representation (UCS-2) to Unicode code points, and back.
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode
 * @type Object
 */

var ucs2 = {
  decode: ucs2decode,
  encode: ucs2encode
};
const punycode = {
  version: version$1,
  ucs2: ucs2,
  toASCII: toASCII,
  toUnicode: toUnicode,
  encode: encode,
  decode: decode
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty$1(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray$3 = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map$1(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray$3(obj[k])) {
        return map$1(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

function map$1 (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

function parse(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty$1(obj, k)) {
      obj[k] = v;
    } else if (isArray$3(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};
const qs = {
  encode: stringify,
  stringify: stringify,
  decode: parse,
  parse: parse
};

// Copyright Joyent, Inc. and other Node contributors.
const URL = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  Url: Url
};
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,

  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

  // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

  // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
  // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    'http': true,
    'https': true,
    'ftp': true,
    'gopher': true,
    'file': true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  };

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject$1(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  return parse$1(this, url, parseQueryString, slashesDenoteHost);
};

function parse$1(self, url, parseQueryString, slashesDenoteHost) {
  if (!isString$1(url)) {
    throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
    splitter =
    (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      self.path = rest;
      self.href = rest;
      self.pathname = simplePath[1];
      if (simplePath[2]) {
        self.search = simplePath[2];
        if (parseQueryString) {
          self.query = parse(self.search.substr(1));
        } else {
          self.query = self.search.substr(1);
        }
      } else if (parseQueryString) {
        self.search = '';
        self.query = {};
      }
      return self;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    self.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      self.slashes = true;
    }
  }
  var i, hec, l, p;
  if (!hostlessProtocol[proto] &&
    (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      self.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    self.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    parseHost(self);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    self.hostname = self.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = self.hostname[0] === '[' &&
      self.hostname[self.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = self.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            self.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (self.hostname.length > hostnameMaxLen) {
      self.hostname = '';
    } else {
      // hostnames are always lower case.
      self.hostname = self.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      self.hostname = toASCII(self.hostname);
    }

    p = self.port ? ':' + self.port : '';
    var h = self.hostname || '';
    self.host = h + p;
    self.href += self.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      self.hostname = self.hostname.substr(1, self.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    self.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    self.search = rest.substr(qm);
    self.query = rest.substr(qm + 1);
    if (parseQueryString) {
      self.query = parse(self.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    self.search = '';
    self.query = {};
  }
  if (rest) self.pathname = rest;
  if (slashedProtocol[lowerProto] &&
    self.hostname && !self.pathname) {
    self.pathname = '/';
  }

  //to support http.request
  if (self.pathname || self.search) {
    p = self.pathname || '';
    var s = self.search || '';
    self.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  self.href = format$1(self);
  return self;
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString$1(obj)) obj = parse$1({}, obj);
  return format$1(obj);
}

function format$1(self) {
  var auth = self.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = self.protocol || '',
    pathname = self.pathname || '',
    hash = self.hash || '',
    host = false,
    query = '';

  if (self.host) {
    host = auth + self.host;
  } else if (self.hostname) {
    host = auth + (self.hostname.indexOf(':') === -1 ?
      self.hostname :
      '[' + this.hostname + ']');
    if (self.port) {
      host += ':' + self.port;
    }
  }

  if (self.query &&
    isObject$1(self.query) &&
    Object.keys(self.query).length) {
    query = stringify(self.query);
  }

  var search = self.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (self.slashes ||
    (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
}

Url.prototype.format = function() {
  return format$1(this);
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString$1(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
      result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }
  var relPath;
  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
    isRelAbs = (
      relative.host ||
      relative.pathname && relative.pathname.charAt(0) === '/'
    ),
    mustEndAbs = (isRelAbs || isSourceAbs ||
      (result.host && relative.pathname)),
    removeAllDots = mustEndAbs,
    srcPath = result.pathname && result.pathname.split('/') || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol];
  relPath = relative.pathname && relative.pathname.split('/') || [];
  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  var authInHost;
  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
      relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      authInHost = result.host && result.host.indexOf('@') > 0 ?
        result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull$1(result.pathname) || !isNull$1(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
        (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
    (result.host || relative.host || srcPath.length > 1) &&
    (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
    (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
    (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
      srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    authInHost = result.host && result.host.indexOf('@') > 0 ?
      result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull$1(result.pathname) || !isNull$1(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
      (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  return parseHost(this);
};

function parseHost(self) {
  var host = self.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      self.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) self.hostname = host;
}

function request(opts, cb) {
  if (typeof opts === 'string')
    opts = urlParse(opts);


  // Normally, the page is loaded from http or https, so not specifying a protocol
  // will result in a (valid) protocol-relative url. However, this won't work if
  // the protocol is something else, like 'file:'
  var defaultProtocol = global$1.location.protocol.search(/^https?:$/) === -1 ? 'http:' : '';

  var protocol = opts.protocol || defaultProtocol;
  var host = opts.hostname || opts.host;
  var port = opts.port;
  var path = opts.path || '/';

  // Necessary for IPv6 addresses
  if (host && host.indexOf(':') !== -1)
    host = '[' + host + ']';

  // This may be a relative url. The browser should always be able to interpret it correctly.
  opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path;
  opts.method = (opts.method || 'GET').toUpperCase();
  opts.headers = opts.headers || {};

  // Also valid opts.auth, opts.mode

  var req = new ClientRequest(opts);
  if (cb)
    req.on('response', cb);
  return req
}

function get(opts, cb) {
  var req = request(opts, cb);
  req.end();
  return req
}

function Agent() {}
Agent.defaultMaxSockets = 4;

var METHODS = [
  'CHECKOUT',
  'CONNECT',
  'COPY',
  'DELETE',
  'GET',
  'HEAD',
  'LOCK',
  'M-SEARCH',
  'MERGE',
  'MKACTIVITY',
  'MKCOL',
  'MOVE',
  'NOTIFY',
  'OPTIONS',
  'PATCH',
  'POST',
  'PROPFIND',
  'PROPPATCH',
  'PURGE',
  'PUT',
  'REPORT',
  'SEARCH',
  'SUBSCRIBE',
  'TRACE',
  'UNLOCK',
  'UNSUBSCRIBE'
];
var STATUS_CODES = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing', // RFC 2518, obsoleted by RFC 4918
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status', // RFC 4918
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Moved Temporarily',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot', // RFC 2324
  422: 'Unprocessable Entity', // RFC 4918
  423: 'Locked', // RFC 4918
  424: 'Failed Dependency', // RFC 4918
  425: 'Unordered Collection', // RFC 4918
  426: 'Upgrade Required', // RFC 2817
  428: 'Precondition Required', // RFC 6585
  429: 'Too Many Requests', // RFC 6585
  431: 'Request Header Fields Too Large', // RFC 6585
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates', // RFC 2295
  507: 'Insufficient Storage', // RFC 4918
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended', // RFC 2774
  511: 'Network Authentication Required' // RFC 6585
};

const HTTPS = {
  request,
  get,
  Agent,
  METHODS,
  STATUS_CODES
};

class HTTPError extends AbstractError {
    static get statusCode() { return null; }
    get name() { return "HTTPError"; }
    constructor(message, response) {
        super(message);
        this.response = response;
    }
}

const name = "BadRequestError";
const statusCode = 400;
class BadRequestError extends HTTPError {
    static get statusCode() { return statusCode; }
    get name() { return name; }
}

const name$1 = "ConflictError";
const statusCode$1 = 409;
class ConflictError extends HTTPError {
    static get statusCode() { return statusCode$1; }
    get name() { return name$1; }
}

const name$2 = "ForbiddenError";
const statusCode$2 = 403;
class ForbiddenError extends HTTPError {
    static get statusCode() { return statusCode$2; }
    get name() { return name$2; }
}

const name$3 = "MethodNotAllowedError";
const statusCode$3 = 405;
class MethodNotAllowedError extends HTTPError {
    static get statusCode() { return statusCode$3; }
    get name() { return name$3; }
}

const name$4 = "NotAcceptableError";
const statusCode$4 = 406;
class NotAcceptableError extends HTTPError {
    static get statusCode() { return statusCode$4; }
    get name() { return name$4; }
}

const name$5 = "NotFoundError";
const statusCode$5 = 404;
class NotFoundError extends HTTPError {
    static get statusCode() { return statusCode$5; }
    get name() { return name$5; }
}

const name$6 = "PreconditionFailedError";
const statusCode$6 = 412;
class PreconditionFailedError extends HTTPError {
    static get statusCode() { return statusCode$6; }
    get name() { return name$6; }
}

const name$7 = "PreconditionRequiredError";
const statusCode$7 = 428;
class PreconditionRequiredError extends HTTPError {
    static get statusCode() { return statusCode$7; }
    get name() { return name$7; }
}

const name$8 = "RequestEntityTooLargeError";
const statusCode$8 = 413;
class RequestEntityTooLargeError extends HTTPError {
    static get statusCode() { return statusCode$8; }
    get name() { return name$8; }
}

const name$9 = "RequestHeaderFieldsTooLargeError";
const statusCode$9 = 431;
class RequestHeaderFieldsTooLargeError extends HTTPError {
    static get statusCode() { return statusCode$9; }
    get name() { return name$9; }
}

const name$a = "RequestURITooLongError";
const statusCode$a = 414;
class RequestURITooLongError extends HTTPError {
    static get statusCode() { return statusCode$a; }
    get name() { return name$a; }
}

const name$b = "TooManyRequestsError";
const statusCode$b = 429;
class TooManyRequestsError extends HTTPError {
    static get statusCode() { return statusCode$b; }
    get name() { return name$b; }
}

const name$c = "UnauthorizedError";
const statusCode$c = 401;
class UnauthorizedError extends HTTPError {
    static get statusCode() { return statusCode$c; }
    get name() { return name$c; }
}

const name$d = "UnsupportedMediaTypeError";
const statusCode$d = 415;
class UnsupportedMediaTypeError extends HTTPError {
    static get statusCode() { return statusCode$d; }
    get name() { return name$d; }
}



const ClientErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BadRequestError: BadRequestError,
    ConflictError: ConflictError,
    ForbiddenError: ForbiddenError,
    MethodNotAllowedError: MethodNotAllowedError,
    NotAcceptableError: NotAcceptableError,
    NotFoundError: NotFoundError,
    PreconditionFailedError: PreconditionFailedError,
    PreconditionRequiredError: PreconditionRequiredError,
    RequestEntityTooLargeError: RequestEntityTooLargeError,
    RequestHeaderFieldsTooLargeError: RequestHeaderFieldsTooLargeError,
    RequestURITooLongError: RequestURITooLongError,
    TooManyRequestsError: TooManyRequestsError,
    UnauthorizedError: UnauthorizedError,
    UnsupportedMediaTypeError: UnsupportedMediaTypeError
});

const name$e = "BadResponseError";
const statusCode$e = 0;
class BadResponseError extends HTTPError {
    static get statusCode() { return statusCode$e; }
    get name() { return name$e; }
}

const name$f = "BadGatewayError";
const statusCode$f = 502;
class BadGatewayError extends HTTPError {
    static get statusCode() { return statusCode$f; }
    get name() { return name$f; }
}

const name$g = "GatewayTimeoutError";
const statusCode$g = 504;
class GatewayTimeoutError extends HTTPError {
    static get statusCode() { return statusCode$g; }
    get name() { return name$g; }
}

const name$h = "HTTPVersionNotSupportedError";
const statusCode$h = 505;
class HTTPVersionNotSupportedError extends HTTPError {
    static get statusCode() { return statusCode$h; }
    get name() { return name$h; }
}

const name$i = "InternalServerErrorError";
const statusCode$i = 500;
class InternalServerErrorError extends HTTPError {
    static get statusCode() { return statusCode$i; }
    get name() { return name$i; }
}

const name$j = "NotImplementedError";
const statusCode$j = 501;
class NotImplementedError$1 extends HTTPError {
    static get statusCode() { return statusCode$j; }
    get name() { return name$j; }
}

const name$k = "ServiceUnavailableError";
const statusCode$k = 503;
class ServiceUnavailableError extends HTTPError {
    static get statusCode() { return statusCode$k; }
    get name() { return name$k; }
}



const ServerErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BadResponseError: BadResponseError,
    BadGatewayError: BadGatewayError,
    GatewayTimeoutError: GatewayTimeoutError,
    HTTPVersionNotSupportedError: HTTPVersionNotSupportedError,
    InternalServerErrorError: InternalServerErrorError,
    NotImplementedError: NotImplementedError$1,
    ServiceUnavailableError: ServiceUnavailableError
});

const name$l = "UnknownError";
class UnknownError extends HTTPError {
    get name() { return name$l; }
}

const statusCodeMap = new Map();
const addErrors = o => Object
    .keys(o)
    .map(k => o[k])
    .forEach(e => statusCodeMap.set(e.statusCode, e));
addErrors(ClientErrors);
addErrors(ServerErrors);

const index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    statusCodeMap: statusCodeMap,
    BadRequestError: BadRequestError,
    ConflictError: ConflictError,
    ForbiddenError: ForbiddenError,
    MethodNotAllowedError: MethodNotAllowedError,
    NotAcceptableError: NotAcceptableError,
    NotFoundError: NotFoundError,
    PreconditionFailedError: PreconditionFailedError,
    PreconditionRequiredError: PreconditionRequiredError,
    RequestEntityTooLargeError: RequestEntityTooLargeError,
    RequestHeaderFieldsTooLargeError: RequestHeaderFieldsTooLargeError,
    RequestURITooLongError: RequestURITooLongError,
    TooManyRequestsError: TooManyRequestsError,
    UnauthorizedError: UnauthorizedError,
    UnsupportedMediaTypeError: UnsupportedMediaTypeError,
    BadResponseError: BadResponseError,
    BadGatewayError: BadGatewayError,
    GatewayTimeoutError: GatewayTimeoutError,
    HTTPVersionNotSupportedError: HTTPVersionNotSupportedError,
    InternalServerErrorError: InternalServerErrorError,
    NotImplementedError: NotImplementedError$1,
    ServiceUnavailableError: ServiceUnavailableError,
    HTTPError: HTTPError,
    UnknownError: UnknownError
});

class Header {
    static parseHeaders(headersString) {
        const headers = new Map();
        headersString.split(/\r?\n/).forEach(strHeader => {
            if (!strHeader.trim())
                return;
            const parts = strHeader.split(":");
            if (parts.length < 2)
                throw new IllegalArgumentError("The header couldn't be parsed.");
            const name = parts[0].trim().toLowerCase();
            const values = Header.__parseValues(parts.slice(1).join(":"));
            if (headers.has(name)) {
                headers.get(name).values.push(...values);
            }
            else {
                headers.set(name, new Header(values));
            }
        });
        return headers;
    }
    static __parseValues(strValues) {
        if (!strValues)
            return [];
        return strValues
            .split(",")
            .map(valueString => {
            return valueString.trim();
        });
    }
    constructor(values) {
        this.values = Array.isArray(values) ?
            values : Header.__parseValues(values);
    }
    hasValue(value) {
        return this.values.indexOf(value) !== -1;
    }
    addValue(value) {
        const newValues = Header.__parseValues(value);
        this.values.push(...newValues);
    }
    toString() {
        return this.values.join(", ");
    }
}

var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod[HTTPMethod["OPTIONS"] = 0] = "OPTIONS";
    HTTPMethod[HTTPMethod["HEAD"] = 1] = "HEAD";
    HTTPMethod[HTTPMethod["GET"] = 2] = "GET";
    HTTPMethod[HTTPMethod["POST"] = 3] = "POST";
    HTTPMethod[HTTPMethod["PUT"] = 4] = "PUT";
    HTTPMethod[HTTPMethod["PATCH"] = 5] = "PATCH";
    HTTPMethod[HTTPMethod["DELETE"] = 6] = "DELETE";
})(HTTPMethod || (HTTPMethod = {}));

class Response {
    constructor(request, data, response) {
        this.request = request;
        if (typeof XMLHttpRequest !== "undefined" && request instanceof XMLHttpRequest) {
            this.status = request.status;
            this.data = request.responseText;
            this.headers = Header.parseHeaders(request.getAllResponseHeaders());
        }
        else {
            this.data = data || "";
            this.status = response && response.statusCode || 0;
            this.headers = new Map();
            if (!response)
                return;
            for (const name in response.headers) {
                const header = new Header(response.headers[name]);
                this.headers.set(name.toLowerCase(), header);
            }
        }
    }
    getHeader(name) {
        name = name.toLowerCase();
        return this.headers.get(name) || null;
    }
    getETag() {
        const eTagHeader = this.getHeader("ETag");
        if (!eTagHeader || !eTagHeader.values.length)
            throw new BadResponseError("The response doesn't contain an ETag", this);
        return eTagHeader.values[0];
    }
}

function __onResolve(resolve, reject, response) {
    if (response.status >= 200 && response.status <= 299) {
        resolve(response);
    }
    else {
        if (!statusCodeMap.has(response.status))
            return reject(new UnknownError(response.data, response));
        reject(new (statusCodeMap.get(response.status))(response.data, response));
    }
}
function __sendWithBrowser(method, url, body, options) {
    return new Promise((resolve, reject) => {
        let request = options.request ? options.request : new XMLHttpRequest();
        request.open(method, url, true);
        if (options.headers)
            options.headers
                .forEach((header, name) => request.setRequestHeader(name, header.toString()));
        request.withCredentials = !!options.sendCredentialsOnCORS;
        if (options.timeout)
            request.timeout = options.timeout;
        request.onload = request.onerror = () => {
            let response = new Response(request);
            __onResolve(resolve, reject, response);
        };
        if (body) {
            request.send(body);
        }
        else {
            request.send();
        }
    });
}
function __sendWithNode(method, url, body, options) {
    return new Promise((resolve, reject) => {
        function returnResponse(request, res) {
            let rawData = [];
            res.on("data", (chunk) => {
                if (typeof chunk === "string")
                    chunk = Buffer.from(chunk, "utf-8");
                rawData.push(chunk);
            }).on("end", () => {
                let data = Buffer.concat(rawData).toString("utf8");
                let response = new Response(request, data, res);
                __onResolve(resolve, reject, response);
            });
        }
        let numberOfRedirects = 0;
        function sendRequestWithRedirect(_url) {
            let parsedURL = URL.parse(_url);
            let Adapter = parsedURL.protocol === "http:" ? HTTPS : HTTPS;
            let requestOptions = {
                protocol: parsedURL.protocol,
                hostname: parsedURL.hostname,
                port: parsedURL.port,
                path: parsedURL.path,
                method: method,
                headers: {},
            };
            if (options.headers)
                options.headers
                    .forEach((header, name) => requestOptions.headers[name] = header.toString());
            let request = Adapter.request(requestOptions);
            if (options.timeout)
                request.setTimeout(options.timeout);
            request.on("response", (res) => {
                if (res.statusCode >= 300 && res.statusCode <= 399 && "location" in res.headers) {
                    if (++numberOfRedirects < 10)
                        return sendRequestWithRedirect(URL.resolve(_url, res.headers.location));
                }
                returnResponse(request, res);
            });
            request.on("error", (error) => {
                let response = new Response(request, error.message);
                __onResolve(resolve, reject, response);
            });
            if (body) {
                if (method === "DELETE")
                    request.useChunkedEncodingByDefault = true;
                request.write(body);
            }
            request.end();
        }
        sendRequestWithRedirect(url);
    });
}
function __sendRequest(method, url, body, options) {
    return typeof XMLHttpRequest !== "undefined" ?
        __sendWithBrowser(method, url, body, options) :
        __sendWithNode(method, url, body, options);
}
function __isBody(data) {
    return isString(data)
        || typeof Blob !== "undefined" && data instanceof Blob
        || typeof Buffer !== "undefined" && data instanceof Buffer;
}
class RequestService {
    static send(method, url, bodyOrOptions, optionsOrParser, parser) {
        let body = undefined;
        let options = hasProperty(optionsOrParser, "parse") ? bodyOrOptions : optionsOrParser;
        parser = hasProperty(optionsOrParser, "parse") ? optionsOrParser : parser;
        if (!bodyOrOptions || __isBody(bodyOrOptions)) {
            body = bodyOrOptions;
        }
        else {
            options = bodyOrOptions ? bodyOrOptions : options;
        }
        options = Object.assign({}, RequestService.defaultOptions, options);
        if (isNumber(method))
            method = HTTPMethod[method];
        const requestPromise = __sendRequest(method, url, body, options)
            .then(response => {
            if (method === "GET" && options.headers)
                return this.__handleGETResponse(url, options, response);
            else
                return response;
        });
        if (!parser)
            return requestPromise;
        return requestPromise.then((response) => {
            return parser.parse(response.data).then((parsedBody) => {
                return [parsedBody, response];
            });
        });
    }
    static options(url, options = RequestService.defaultOptions) {
        return RequestService.send(HTTPMethod.OPTIONS, url, options);
    }
    static head(url, options = RequestService.defaultOptions) {
        return RequestService.send(HTTPMethod.HEAD, url, options);
    }
    static get(url, options = RequestService.defaultOptions, parser) {
        return RequestService.send(HTTPMethod.GET, url, undefined, options, parser);
    }
    static post(url, bodyOrOptions = RequestService.defaultOptions, options = RequestService.defaultOptions, parser) {
        return RequestService.send(HTTPMethod.POST, url, bodyOrOptions, options, parser);
    }
    static put(url, bodyOrOptions = RequestService.defaultOptions, options = RequestService.defaultOptions, parser) {
        return RequestService.send(HTTPMethod.PUT, url, bodyOrOptions, options, parser);
    }
    static patch(url, bodyOrOptions = RequestService.defaultOptions, options = RequestService.defaultOptions, parser) {
        return RequestService.send(HTTPMethod.PATCH, url, bodyOrOptions, options, parser);
    }
    static delete(url, bodyOrOptions = RequestService.defaultOptions, optionsOrParser = RequestService.defaultOptions, parser) {
        return RequestService.send(HTTPMethod.DELETE, url, bodyOrOptions, optionsOrParser, parser);
    }
    static __handleGETResponse(url, requestOptions, response) {
        return Promise.resolve()
            .then(() => {
            if (this.__contentTypeIsAccepted(requestOptions, response))
                return response;
            this.__setNoCacheHeaders(requestOptions);
            if (!this.__isChromiumAgent())
                this.__setFalseETag(requestOptions);
            return __sendRequest("GET", url, undefined, requestOptions)
                .then(noCachedResponse => {
                if (!this.__contentTypeIsAccepted(requestOptions, response)) {
                    throw new BadResponseError("The server responded with an unacceptable Content-Type", response);
                }
                return noCachedResponse;
            });
        });
    }
    static __contentTypeIsAccepted(requestOptions, response) {
        if (!requestOptions.headers)
            return true;
        const accepts = requestOptions.headers.has("accept") ?
            requestOptions.headers.get("accept").values :
            [];
        const contentType = response.headers.has("content-type") ?
            response.headers.get("content-type") :
            undefined;
        return !contentType || accepts.some(contentType.hasValue, contentType);
    }
    static __setNoCacheHeaders(requestOptions) {
        requestOptions.headers
            .set("pragma", new Header("no-cache"))
            .set("cache-control", new Header("no-cache, max-age=0"));
    }
    static __isChromiumAgent() {
        return typeof window !== "undefined" && !!window["chrome"];
    }
    static __setFalseETag(requestOptions) {
        requestOptions.headers.set("if-none-match", new Header());
    }
}
RequestService.defaultOptions = {
    sendCredentialsOnCORS: true,
};
class RequestUtils {
    static getHeader(headerName, requestOptions, initialize) {
        if (!requestOptions.headers) {
            if (!initialize)
                return undefined;
            requestOptions.headers = new Map();
        }
        headerName = headerName.toLowerCase();
        let header = requestOptions.headers.get(headerName);
        if (!header) {
            if (!initialize)
                return undefined;
            header = new Header();
            requestOptions.headers.set(headerName, header);
        }
        return header;
    }
    static setAcceptHeader(accept, requestOptions) {
        RequestUtils.__addHeaderValue("accept", accept, requestOptions);
        return requestOptions;
    }
    static setContentTypeHeader(contentType, requestOptions) {
        RequestUtils.__addHeaderValue("content-type", contentType, requestOptions);
        return requestOptions;
    }
    static setIfMatchHeader(eTag, requestOptions) {
        if (!eTag)
            return requestOptions;
        RequestUtils.__addHeaderValue("if-match", eTag, requestOptions);
        return requestOptions;
    }
    static setIfNoneMatchHeader(eTag, requestOptions) {
        if (!eTag)
            return requestOptions;
        RequestUtils.__addHeaderValue("if-none-match", eTag, requestOptions);
        return requestOptions;
    }
    static setPreferredInteractionModel(interactionModelURI, requestOptions) {
        const headerValue = `${interactionModelURI}; rel=interaction-model`;
        RequestUtils.__addHeaderValue("prefer", headerValue, requestOptions);
        return requestOptions;
    }
    static setPreferredRetrieval(retrievalType, requestOptions) {
        const headerValue = `return=${retrievalType}`;
        RequestUtils.__addHeaderValue("prefer", headerValue, requestOptions);
        return requestOptions;
    }
    static setRetrievalPreferences(preferences, requestOptions) {
        const prefer = RequestUtils.getHeader("prefer", requestOptions, true);
        const keys = ["include", "omit"];
        for (const key of keys) {
            if (!(key in preferences))
                continue;
            if (preferences[key].length <= 0)
                continue;
            const strPreferences = preferences[key].join(" ");
            prefer.values.push(`${key}="${strPreferences}"`);
        }
        return requestOptions;
    }
    static setSlug(slug, requestOptions) {
        RequestUtils.__addHeaderValue("slug", slug, requestOptions);
        return requestOptions;
    }
    static isOptions(value) {
        return hasPropertyDefined(value, "headers")
            || hasPropertyDefined(value, "sendCredentialsOnCORS")
            || hasPropertyDefined(value, "timeout")
            || hasPropertyDefined(value, "request");
    }
    static cloneOptions(options) {
        const clone = Object.assign({}, options, { headers: new Map() });
        if (options.headers)
            options.headers
                .forEach((value, key) => clone.headers.set(key, new Header(value.values.slice())));
        return clone;
    }
    static __addHeaderValue(headerName, headerValue, requestOptions) {
        const header = RequestUtils.getHeader(headerName, requestOptions, true);
        header.addValue(headerValue);
    }
}

var PointerType;
(function (PointerType) {
    PointerType[PointerType["ID"] = 0] = "ID";
    PointerType[PointerType["VOCAB"] = 1] = "VOCAB";
})(PointerType || (PointerType = {}));

class ObjectSchemaDigester {
    static digestSchema(schemas) {
        if (!Array.isArray(schemas))
            return ObjectSchemaDigester._digestSchema(schemas);
        const digestedSchemas = schemas
            .map(schema => ObjectSchemaDigester._digestSchema(schema));
        return ObjectSchemaDigester._combineSchemas(digestedSchemas);
    }
    static digestProperty(name, definition, digestedSchema) {
        const digestedDefinition = new DigestedObjectSchemaProperty();
        if ("@id" in definition) {
            const uri = definition["@id"];
            if (URI.isPrefixed(name))
                throw new IllegalArgumentError("A prefixed property cannot have assigned another URI.");
            if (!isString(uri))
                throw new IllegalArgumentError("@id needs to point to a string");
            digestedDefinition.uri = uri;
        }
        else {
            digestedDefinition.uri = name;
        }
        if ("@type" in definition) {
            let type = definition["@type"];
            if (!isString(type))
                throw new IllegalArgumentError("@type needs to point to a string");
            if (type === "@id" || type === "@vocab") {
                digestedDefinition.literal = false;
                digestedDefinition.pointerType = type === "@id" ? PointerType.ID : PointerType.VOCAB;
            }
            else {
                if (URI.isRelative(type) && type in XSD)
                    type = XSD[type];
                digestedDefinition.literal = true;
                digestedDefinition.literalType = type;
            }
        }
        if ("@language" in definition) {
            const language = definition["@language"];
            if (language !== null && !isString(language))
                throw new IllegalArgumentError("@language needs to point to a string or null.");
            digestedDefinition.literal = true;
            digestedDefinition.language = language;
        }
        if ("@container" in definition) {
            switch (definition["@container"]) {
                case "@set":
                    digestedDefinition.containerType = ContainerType.SET;
                    break;
                case "@list":
                    digestedDefinition.containerType = ContainerType.LIST;
                    break;
                case "@language":
                    if (isString(digestedDefinition.language))
                        throw new IllegalArgumentError("@container cannot be set to @language when the property definition already contains an @language tag.");
                    digestedDefinition.containerType = ContainerType.LANGUAGE;
                    break;
                default:
                    throw new IllegalArgumentError("@container needs to be equal to '@list', '@set', or '@language'");
            }
        }
        return digestedSchema ?
            ObjectSchemaUtils._resolveProperty(digestedSchema, digestedDefinition, true) :
            digestedDefinition;
    }
    static combineDigestedObjectSchemas(digestedSchemas) {
        if (digestedSchemas.length === 0)
            throw new IllegalArgumentError("At least one DigestedObjectSchema needs to be specified.");
        digestedSchemas.unshift(new DigestedObjectSchema());
        return ObjectSchemaDigester._combineSchemas(digestedSchemas);
    }
    static _digestSchema(schema) {
        const digestedSchema = new DigestedObjectSchema();
        for (const propertyName of ["@base", "@vocab"]) {
            if (!(propertyName in schema))
                continue;
            const value = schema[propertyName];
            if (value !== null && !isString(value))
                throw new IllegalArgumentError(`The value of '${propertyName}' must be a string or null.`);
            if ((propertyName === "@vocab" && value === "") || (value && !URI.isAbsolute(value) && !URI.isBNodeID(value)))
                throw new IllegalArgumentError(`The value of '${propertyName}' must be an absolute URI${propertyName === "@base" ? " or an empty string" : ""}.`);
            digestedSchema[propertyName.substr(1)] = value;
        }
        digestedSchema.base = digestedSchema.base || "";
        if ("@language" in schema) {
            const value = schema["@language"];
            if (value !== null && !isString(value))
                throw new InvalidJSONLDSyntaxError(`The value of '@language' must be a string or null.`);
            digestedSchema.language = value;
        }
        for (const propertyName in schema) {
            if (!schema.hasOwnProperty(propertyName))
                continue;
            if (propertyName === "@reverse")
                continue;
            if (propertyName === "@index")
                continue;
            if (propertyName === "@base")
                continue;
            if (propertyName === "@vocab")
                continue;
            if (propertyName === "@language")
                continue;
            let propertyValue = schema[propertyName];
            if (isString(propertyValue)) {
                if (URI.isPrefixed(propertyName))
                    throw new IllegalArgumentError("A prefixed property cannot be equal to another URI.");
                digestedSchema.prefixes.set(propertyName, propertyValue);
            }
            else if (!!propertyValue && isObject(propertyValue)) {
                const definition = ObjectSchemaDigester.digestProperty(propertyName, propertyValue);
                digestedSchema.properties.set(propertyName, definition);
            }
            else {
                throw new IllegalArgumentError("ObjectSchema Properties can only have string values or object values.");
            }
        }
        return digestedSchema;
    }
    static _combineSchemas(digestedSchemas) {
        const [targetSchema, ...restSchemas] = digestedSchemas;
        restSchemas.forEach(schema => {
            if (schema.vocab !== void 0)
                targetSchema.vocab = schema.vocab;
            if (schema.base !== "")
                targetSchema.base = schema.base;
            if (schema.language !== null)
                targetSchema.language = schema.language;
            MapUtils.extend(targetSchema.prefixes, schema.prefixes);
            MapUtils.extend(targetSchema.properties, schema.properties);
        });
        return targetSchema;
    }
}

const MAX_CONTEXT_URLS = 10;
const LINK_HEADER_REL = "http://www.w3.org/ns/json-ld#context";
class JSONLDProcessor {
    static expand(input) {
        return JSONLDProcessor.__retrieveContexts(input, Object.create(null), "").then(() => {
            let expanded = JSONLDProcessor.__process(new DigestedObjectSchema(), input);
            if (isObject(expanded) && "@graph" in expanded && Object.keys(expanded).length === 1) {
                expanded = expanded["@graph"];
            }
            else if (expanded === null) {
                expanded = [];
            }
            if (!isArray(expanded))
                expanded = [expanded];
            return expanded;
        });
    }
    static __getTargetFromLinkHeader(header) {
        let rLinkHeader = /\s*<([^>]*?)>\s*(?:;\s*(.*))?/;
        for (let value of header.values) {
            let match = value.toString().match(rLinkHeader);
            if (!match)
                continue;
            let target = match[1];
            let params = match[2];
            let rParams = /(.*?)=(?:(?:"([^"]*?)")|([^"]*?))\s*(?:(?:;\s*)|$)/g;
            let result = {};
            while (true) {
                match = rParams.exec(params);
                if (!match)
                    break;
                result[match[1]] = (match[2] === undefined) ? match[3] : match[2];
            }
            if (result["rel"] === LINK_HEADER_REL)
                return target;
        }
    }
    static __findContextURLs(input, contexts, base, replace = false) {
        let previousContexts = Object.keys(contexts).length;
        if (isArray(input)) {
            for (let element of input) {
                JSONLDProcessor.__findContextURLs(element, contexts, base);
            }
        }
        else if (isPlainObject(input)) {
            for (let key in input) {
                if ("@context" !== key) {
                    JSONLDProcessor.__findContextURLs(input[key], contexts, base);
                    continue;
                }
                let urlOrArrayOrContext = input[key];
                if (isArray(urlOrArrayOrContext)) {
                    let contextArray = urlOrArrayOrContext;
                    for (let index = 0, length = contextArray.length; index < length; ++index) {
                        let urlOrContext = contextArray[index];
                        if (!isString(urlOrContext))
                            continue;
                        let url = urlOrContext;
                        url = URI.resolve(base, url);
                        if (replace) {
                            if (isArray(contexts[url])) {
                                contextArray.splice(index, 1, ...[].concat(contexts[url]));
                                index += contexts[url].length - 1;
                                length = contextArray.length;
                            }
                            else {
                                contextArray[index] = contexts[url];
                            }
                        }
                        else if (!(url in contexts)) {
                            contexts[url] = true;
                        }
                    }
                }
                else if (isString(urlOrArrayOrContext)) {
                    let url = urlOrArrayOrContext;
                    url = URI.resolve(base, url);
                    if (replace) {
                        input[key] = contexts[url];
                    }
                    else if (!(url in contexts)) {
                        contexts[url] = null;
                    }
                }
            }
        }
        return previousContexts < Object.keys(contexts).length;
    }
    static __retrieveContexts(input, contextsRequested, base) {
        if (Object.keys(contextsRequested).length > MAX_CONTEXT_URLS)
            return Promise.reject(new InvalidJSONLDSyntaxError("Maximum number of @context URLs exceeded."));
        let contextToResolved = Object.create(null);
        if (!JSONLDProcessor.__findContextURLs(input, contextToResolved, base))
            return Promise.resolve();
        function resolved(url, promise) {
            return promise.then(([object, response]) => {
                let _contextsRequested = ObjectUtils.clone(contextsRequested);
                _contextsRequested[url] = true;
                let contextWrapper = { "@context": {} };
                let header = response.getHeader("Content-Type");
                if (!header || !header.toString().includes("application/ld+json")) {
                    let link;
                    header = response.getHeader("Link");
                    if (header)
                        link = JSONLDProcessor.__getTargetFromLinkHeader(header);
                    if (link)
                        contextWrapper["@context"] = link;
                }
                else {
                    contextWrapper["@context"] = "@context" in object ? object["@context"] : {};
                }
                contextToResolved[url] = contextWrapper["@context"];
                return JSONLDProcessor.__retrieveContexts(contextWrapper, _contextsRequested, url);
            });
        }
        let promises = [];
        for (let url in contextToResolved) {
            if (url in contextsRequested)
                return Promise.reject(new InvalidJSONLDSyntaxError("Cyclical @context URLs detected."));
            let requestOptions = { sendCredentialsOnCORS: false };
            RequestUtils.setAcceptHeader("application/ld+json, application/json", requestOptions);
            let promise = RequestService
                .get(url, requestOptions, new JSONParser())
                .catch((response) => Promise.reject(new InvalidJSONLDSyntaxError(`Unable to resolve context from "${url}". Status code: ${response.status}`)));
            promises.push(resolved(url, promise));
        }
        return Promise.all(promises).then(() => {
            JSONLDProcessor.__findContextURLs(input, contextToResolved, base, true);
        });
    }
    static __isKeyword(value) {
        if (!isString(value))
            return false;
        switch (value) {
            case "@base":
            case "@context":
            case "@container":
            case "@default":
            case "@embed":
            case "@explicit":
            case "@graph":
            case "@id":
            case "@index":
            case "@language":
            case "@list":
            case "@omitDefault":
            case "@preserve":
            case "@requireAll":
            case "@reverse":
            case "@set":
            case "@type":
            case "@value":
            case "@vocab":
                return true;
            default:
                return false;
        }
    }
    static __isValidType(value) {
        if (isString(value))
            return true;
        if (!isArray(value))
            return false;
        for (let element of value) {
            if (!isString(element))
                return false;
        }
        return true;
    }
    static __expandURI(schema, uri, relativeTo) {
        if (JSONLDProcessor.__isKeyword(uri))
            return uri;
        return schema.resolveURI(uri, relativeTo);
    }
    static __expandLanguageMap(languageMap) {
        let expandedLanguage = [];
        let keys = Object.keys(languageMap).sort();
        for (let key of keys) {
            let values = languageMap[key];
            if (!isArray(values))
                values = [values];
            for (let item of values) {
                if (item === null)
                    continue;
                if (!isString(item))
                    throw new InvalidJSONLDSyntaxError("Language map values must be strings.");
                expandedLanguage.push({
                    "@value": item,
                    "@language": key.toLowerCase(),
                });
            }
        }
        return expandedLanguage;
    }
    static __getContainer(context, property) {
        if (!property || !context.properties.has(property))
            return null;
        return context.properties.get(property).containerType;
    }
    static __expandValue(context, value, propertyName) {
        if (value === null || !isDefined(value))
            return null;
        if (propertyName === "@id") {
            return JSONLDProcessor.__expandURI(context, value, { base: true });
        }
        else if (propertyName === "@type") {
            return JSONLDProcessor.__expandURI(context, value, { vocab: true, base: true });
        }
        const definition = propertyName && context.properties.has(propertyName)
            ? context.properties.get(propertyName)
            : new DigestedObjectSchemaProperty();
        if (definition.literal === false || (propertyName === "@graph" && isString(value))) {
            let options = { base: true };
            if (definition.pointerType === PointerType.VOCAB)
                options.vocab = true;
            return { "@id": JSONLDProcessor.__expandURI(context, value, options) };
        }
        if (JSONLDProcessor.__isKeyword(propertyName))
            return value;
        let expandedValue = {};
        if (definition.literalType) {
            expandedValue["@type"] = context.resolveURI(definition.literalType, { vocab: true, base: true });
        }
        else if (isString(value)) {
            let language = isDefined(definition.language) ? definition.language : context.language;
            if (language)
                expandedValue["@language"] = language;
        }
        if (["boolean", "number", "string"].indexOf(typeof value) === -1)
            value = value.toString();
        expandedValue["@value"] = value;
        return expandedValue;
    }
    static __process(context, element, activeProperty, insideList) {
        if (element === null || !isDefined(element))
            return null;
        if (!isArray(element) && !isObject(element)) {
            if (!insideList && (activeProperty === null || activeProperty === "@graph"))
                return null;
            return JSONLDProcessor.__expandValue(context, element, activeProperty);
        }
        if (isArray(element)) {
            let container = JSONLDProcessor.__getContainer(context, activeProperty);
            insideList = insideList || container === ContainerType.LIST;
            const expanded = [];
            for (let item of element) {
                let expandedItem = JSONLDProcessor.__process(context, item, activeProperty);
                if (expandedItem === null)
                    continue;
                if (insideList && (isArray(expandedItem) || RDFList.is(expandedItem)))
                    throw new InvalidJSONLDSyntaxError("Lists of lists are not permitted.");
                if (!isArray(expandedItem))
                    expandedItem = [expandedItem];
                expanded.push(...expandedItem);
            }
            return expanded;
        }
        if ("@context" in element) {
            context = ObjectSchemaDigester
                .combineDigestedObjectSchemas([
                context,
                ObjectSchemaDigester.digestSchema(element["@context"]),
            ]);
        }
        let expandedElement = {};
        let keys = Object.keys(element);
        for (let key of keys) {
            if (key === "@context")
                continue;
            let uri = JSONLDProcessor.__expandURI(context, key, { vocab: true });
            if (!uri || !(URI.isAbsolute(uri) || URI.isBNodeID(uri) || JSONLDProcessor.__isKeyword(uri)))
                continue;
            let value = element[key];
            if (JSONLDProcessor.__isKeyword(uri)) {
                if (uri === "@id" && !isString(value))
                    throw new InvalidJSONLDSyntaxError(`"@id" value must a string.`);
                if (uri === "@type" && !JSONLDProcessor.__isValidType(value))
                    throw new InvalidJSONLDSyntaxError(`"@type" value must a string, an array of strings.`);
                if (uri === "@graph" && !(isObject(value) || isArray(value)))
                    throw new InvalidJSONLDSyntaxError(`"@graph" value must not be an object or an array.`);
                if (uri === "@value" && (isObject(value) || isArray(value)))
                    throw new InvalidJSONLDSyntaxError(`"@value" value must not be an object or an array.`);
                if (uri === "@language") {
                    if (value === null)
                        continue;
                    if (!isString(value))
                        throw new InvalidJSONLDSyntaxError(`"@language" value must be a string.`);
                    value = value.toLowerCase();
                }
                if (uri === "@index" && !isString(value))
                    throw new InvalidJSONLDSyntaxError(`"@index" value must be a string.`);
                if (uri === "@reverse" && !isObject(value))
                    throw new InvalidJSONLDSyntaxError(`"@reverse" value must be an object.`);
                if (uri === "@index" || uri === "@reverse")
                    throw new NotImplementedError(`The SDK does not support "@index" and "@reverse" tags.`);
            }
            let expandedValue;
            let container = JSONLDProcessor.__getContainer(context, key);
            if (container === ContainerType.LANGUAGE && isObject(value)) {
                expandedValue = JSONLDProcessor.__expandLanguageMap(value);
            }
            else {
                let nextActiveProperty = key;
                let isList = uri === "@list";
                if (isList || uri === "@set") {
                    nextActiveProperty = activeProperty;
                    if (isList && activeProperty === "@graph")
                        nextActiveProperty = null;
                }
                expandedValue = JSONLDProcessor.__process(context, value, nextActiveProperty, isList);
            }
            if (expandedValue === null && uri !== "@value")
                continue;
            if (uri !== "@list" && !RDFList.is(expandedValue) && container === ContainerType.LIST) {
                if (!isArray(expandedValue))
                    expandedValue = [expandedValue];
                expandedValue = { "@list": expandedValue };
            }
            let useArray = ["@type", "@id", "@value", "@language"].indexOf(uri) === -1;
            JSONLDProcessor.__addValue(expandedElement, uri, expandedValue, { propertyIsArray: useArray });
        }
        if ("@value" in expandedElement) {
            if (expandedElement["@value"] === null)
                expandedElement = null;
        }
        else if ("@type" in expandedElement) {
            if (!isArray(expandedElement["@type"]))
                expandedElement["@type"] = [expandedElement["@type"]];
        }
        else if ("@set" in expandedElement) {
            expandedElement = expandedElement["@set"];
        }
        return expandedElement;
    }
    static __addValue(element, propertyName, value, options) {
        if (isArray(value)) {
            let values = value;
            if (values.length === 0 && options.propertyIsArray && !hasProperty(element, propertyName))
                element[propertyName] = [];
            for (let item of values) {
                JSONLDProcessor.__addValue(element, propertyName, item, options);
            }
        }
        else if (propertyName in element) {
            if (!JSONLDProcessor.__hasValue(element, propertyName, value)) {
                let items = element[propertyName];
                if (!isArray(items))
                    items = element[propertyName] = [items];
                items.push(value);
            }
        }
        else {
            element[propertyName] = options.propertyIsArray ? [value] : value;
        }
    }
    static __hasProperty(element, propertyName) {
        if (propertyName in element) {
            let item = element[propertyName];
            return !isArray(item) || item.length > 0;
        }
        return false;
    }
    static __compareValues(value1, value2) {
        if (value1 === value2)
            return true;
        if (isObject(value1) && isObject(value2)) {
            if ("@value" in value1
                && value1["@value"] === value2["@value"]
                && value1["@type"] === value2["@type"]
                && value1["@language"] === value2["@language"]
                && value1["@index"] === value2["@index"])
                return true;
            if ("@id" in value1)
                return value1["@id"] === value2["@id"];
        }
        return false;
    }
    static __hasValue(element, propertyName, value) {
        if (JSONLDProcessor.__hasProperty(element, propertyName)) {
            let item = element[propertyName];
            let isList = RDFList.is(item);
            if (isList || isArray(item)) {
                let items = isList ? item["@list"] : item;
                for (let entry of items) {
                    if (JSONLDProcessor.__compareValues(entry, value))
                        return true;
                }
            }
            else if (!isArray(value)) {
                return JSONLDProcessor.__compareValues(item, value);
            }
        }
        return false;
    }
}

//# sourceMappingURL=JSONLDProcessor.js.map

class JSONLDParser extends JSONParser {
    parse(input) {
        return super.parse(input).then(JSONLDProcessor.expand);
    }
}

const C = {
    namespace: "https://carbonldp.com/ns/v1/platform#",
    AccessPoint: "https://carbonldp.com/ns/v1/platform#AccessPoint",
    AddMemberAction: "https://carbonldp.com/ns/v1/platform#AddMemberAction",
    ChildCreatedEvent: "https://carbonldp.com/ns/v1/platform#ChildCreatedEvent",
    Document: "https://carbonldp.com/ns/v1/platform#Document",
    DocumentCreatedEventDetails: "https://carbonldp.com/ns/v1/platform#DocumentCreatedEventDetails",
    DocumentDeletedEvent: "https://carbonldp.com/ns/v1/platform#DocumentDeletedEvent",
    DocumentMetadata: "https://carbonldp.com/ns/v1/platform#DocumentMetadata",
    DocumentModifiedEvent: "https://carbonldp.com/ns/v1/platform#DocumentModifiedEvent",
    ErrorResponse: "https://carbonldp.com/ns/v1/platform#ErrorResponse",
    Error: "https://carbonldp.com/ns/v1/platform#Error",
    Instance: "https://carbonldp.com/ns/v1/platform#Instance",
    Map: "https://carbonldp.com/ns/v1/platform#Map",
    MemberAddedEvent: "https://carbonldp.com/ns/v1/platform#MemberAddedEvent",
    MemberAddedEventDetails: "https://carbonldp.com/ns/v1/platform#MemberAddedEventDetails",
    MemberRemovedEvent: "https://carbonldp.com/ns/v1/platform#MemberRemovedEvent",
    MemberRemovedEventDetails: "https://carbonldp.com/ns/v1/platform#MemberRemovedEventDetails",
    NonReadableMembershipResourceTriples: "https://carbonldp.com/ns/v1/platform#NonReadableMembershipResourceTriples",
    Platform: "https://carbonldp.com/ns/v1/platform#Platform",
    PlatformInstance: "https://carbonldp.com/ns/v1/platform#PlatformInstance",
    PreferContainer: "https://carbonldp.com/ns/v1/platform#PreferContainer",
    PreferContainmentResources: "https://carbonldp.com/ns/v1/platform#PreferContainmentResources",
    PreferContainmentTriples: "https://carbonldp.com/ns/v1/platform#PreferContainmentTriples",
    PreferDocumentChecksums: "https://carbonldp.com/ns/v1/platform#PreferDocumentChecksums",
    PreferMembershipResources: "https://carbonldp.com/ns/v1/platform#PreferMembershipResources",
    PreferMembershipTriples: "https://carbonldp.com/ns/v1/platform#PreferMembershipTriples",
    PreferResultsContexts: "https://carbonldp.com/ns/v1/platform#PreferResultsContexts",
    PreferSelectedMembershipTriples: "https://carbonldp.com/ns/v1/platform#PreferSelectedMembershipTriples",
    QueryMetadata: "https://carbonldp.com/ns/v1/platform#QueryMetadata",
    RemoveMemberAction: "https://carbonldp.com/ns/v1/platform#RemoveMemberAction",
    ResponseMetadata: "https://carbonldp.com/ns/v1/platform#ResponseMetadata",
    ValidationError: "https://carbonldp.com/ns/v1/platform#ValidationError",
    VolatileResource: "https://carbonldp.com/ns/v1/platform#VolatileResource",
    accessPoint: "https://carbonldp.com/ns/v1/platform#accessPoint",
    bNodesMap: "https://carbonldp.com/ns/v1/platform#bNodesMap",
    buildDate: "https://carbonldp.com/ns/v1/platform#buildDate",
    checksum: "https://carbonldp.com/ns/v1/platform#checksum",
    created: "https://carbonldp.com/ns/v1/platform#created",
    createdDocument: "https://carbonldp.com/ns/v1/platform#createdDocument",
    details: "https://carbonldp.com/ns/v1/platform#details",
    defaultInteractionModel: "https://carbonldp.com/ns/v1/platform#defaultInteractionModel",
    document: "https://carbonldp.com/ns/v1/platform#document",
    documentMetadata: "https://carbonldp.com/ns/v1/platform#documentMetadata",
    entry: "https://carbonldp.com/ns/v1/platform#entry",
    entryKey: "https://carbonldp.com/ns/v1/platform#entryKey",
    entryValue: "https://carbonldp.com/ns/v1/platform#entryValue",
    error: "https://carbonldp.com/ns/v1/platform#error",
    errorCode: "https://carbonldp.com/ns/v1/platform#errorCode",
    errorDetails: "https://carbonldp.com/ns/v1/platform#errorDetails",
    errorMessage: "https://carbonldp.com/ns/v1/platform#errorMessage",
    errorParameters: "https://carbonldp.com/ns/v1/platform#errorParameters",
    httpStatusCode: "https://carbonldp.com/ns/v1/platform#httpStatusCode",
    instance: "https://carbonldp.com/ns/v1/platform#instance",
    mediaType: "https://carbonldp.com/ns/v1/platform#mediaType",
    member: "https://carbonldp.com/ns/v1/platform#member",
    modified: "https://carbonldp.com/ns/v1/platform#modified",
    requestID: "https://carbonldp.com/ns/v1/platform#requestID",
    relatedDocument: "https://carbonldp.com/ns/v1/platform#relatedDocument",
    size: "https://carbonldp.com/ns/v1/platform#size",
    target: "https://carbonldp.com/ns/v1/platform#target",
    targetMember: "https://carbonldp.com/ns/v1/platform#targetMember",
    version: "https://carbonldp.com/ns/v1/platform#version",
};

const SCHEMA = {
    "errors": {
        "@id": C.error,
        "@type": "@id",
        "@container": "@set",
    },
    "requestID": {
        "@id": C.requestID,
        "@type": XSD.string,
    },
    "statusCode": {
        "@id": C.httpStatusCode,
        "@type": XSD.int,
    },
};
const ErrorResponse = {
    TYPE: C.ErrorResponse,
    SCHEMA,
    is(value) {
        return Resource.is(value)
            && value.$hasType(ErrorResponse.TYPE);
    },
    getMessage(errorResponse) {
        return errorResponse.errors
            .map(error => error.errorMessage)
            .join(", ");
    },
};

const RDFDocument = {
    is(value) {
        return hasProperty(value, "@graph")
            && isArray(value["@graph"]);
    },
    create(resources, uri) {
        return {
            "@id": uri ? uri : "",
            "@graph": resources,
        };
    },
    getDocuments(objects) {
        if (isArray(objects))
            return objects
                .filter(RDFDocument.is);
        if (RDFDocument.is(objects))
            return [objects];
        return [];
    },
    getFreeNodes(objects) {
        if (!Array.isArray(objects))
            return [];
        return objects
            .filter(element => !RDFDocument.is(element))
            .filter(RDFNode.is);
    },
    getResources(objects) {
        const resources = RDFDocument.getFreeNodes(objects);
        RDFDocument
            .getDocuments(objects)
            .map(document => document["@graph"])
            .forEach(nodes => resources.push(...nodes));
        return resources;
    },
    getDocumentResources(document) {
        return RDFDocument
            .getResources(document)
            .filter(node => !RDFNode.isFragment(node));
    },
    getNamedFragmentResources(document, documentResource) {
        const uriToMatch = isObject(documentResource) ?
            RDFNode.getID(documentResource) :
            documentResource;
        return RDFDocument
            .getResources(document)
            .filter(node => {
            const id = RDFNode.getID(node);
            if (!URI.hasFragment(id))
                return;
            if (!uriToMatch)
                return true;
            return URI.getDocumentURI(id) === uriToMatch;
        });
    },
    getBNodeResources(document) {
        return RDFDocument
            .getResources(document)
            .filter(node => {
            const id = RDFNode.getID(node);
            return URI.isBNodeID(id);
        });
    },
    getNodes(rdfDocument) {
        const documentNodes = [];
        const fragmentNodes = [];
        for (const node of rdfDocument["@graph"]) {
            (RDFNode.isFragment(node) ? fragmentNodes : documentNodes).push(node);
        }
        return [documentNodes, fragmentNodes];
    },
};

function _parseURIParams(resource, uri, args) {
    const _uri = isString(uri) ?
        URI.resolve(resource.$id, uri) : resource.$id;
    const _args = !isString(uri) ?
        Array.from(args) :
        Array.prototype.slice.call(args, 1);
    return { _uri, _args };
}
function _parseResourceParams(resource, $resource, args) {
    const _resource = Pointer.is($resource) ?
        $resource : resource;
    const _args = !Pointer.is($resource) ?
        Array.from(args) :
        Array.prototype.slice.call(args, 1);
    return { _resource, _args };
}
function _getErrorResponseParserFn(registry) {
    return (error) => {
        if (!("response" in error))
            return Promise.reject(error);
        if (!error.response.data)
            return Promise.reject(error);
        return new JSONLDParser()
            .parse(error.response.data)
            .then((rdfNodes) => {
            const freeNodes = RDFDocument.getFreeNodes(rdfNodes);
            const freeResources = FreeResources.parseFreeNodes(registry, freeNodes);
            const errorResponses = freeResources
                .getPointers(true)
                .filter(ErrorResponse.is);
            if (errorResponses.length === 0)
                return Promise.reject(error);
            const errorResponse = Object.assign(error, errorResponses[0]);
            error.message = ErrorResponse.getMessage(errorResponse);
            return Promise.reject(error);
        }, () => {
            return Promise.reject(error);
        });
    };
}

function __internalRevert(target, source) {
    if (!isObject(target) || !isObject(source))
        return;
    new Set([
        ...Object.keys(target),
        ...Object.keys(source),
    ]).forEach(key => {
        const sourceValue = Array.isArray(source[key]) ?
            [...source[key]] : source[key];
        if (sourceValue === null || sourceValue === void 0) {
            delete target[key];
            return;
        }
        if (isFunction(sourceValue))
            return;
        target[key] = sourceValue;
    });
}
const ResolvablePointer = {
    PROTOTYPE: {
        get $repository() {
            throw new IllegalArgumentError(`Property "$repository" is required.`);
        },
        $eTag: void 0,
        $_resolved: false,
        $isResolved() {
            return this.$_resolved;
        },
        $_snapshot: {},
        $_syncSnapshot() {
            const clone = ObjectUtils.clone(this, { arrays: true });
            if (this.types)
                clone.types = [...this.types];
            this.$_snapshot = clone;
        },
        $isDirty() {
            return !ObjectUtils
                .areEqual(this, this.$_snapshot, { arrays: true });
        },
        $revert() {
            __internalRevert(this, this.$_snapshot);
            if (!this.types)
                this.types = [];
        },
        $get(uri) {
            const { _uri, _args } = _parseURIParams(this, uri, arguments);
            return "$id" in this.$repository ?
                this.$repository.$get(_uri, ..._args) :
                this.$repository.get(_uri, ..._args);
        },
        $resolve(resource) {
            const { _resource, _args } = _parseResourceParams(this, resource, arguments);
            return "$id" in this.$repository ?
                this.$repository.$resolve(_resource, ..._args) :
                this.$repository.resolve(_resource, ..._args);
        },
        $exists(uri) {
            const { _uri, _args } = _parseURIParams(this, uri, arguments);
            return "$id" in this.$repository ?
                this.$repository.$exists(_uri, ..._args) :
                this.$repository.exists(_uri, ..._args);
        },
        $refresh(resource, ...args) {
            const { _resource, _args } = _parseResourceParams(this, resource, arguments);
            return "$id" in this.$repository ?
                this.$repository.$refresh(_resource, ..._args) :
                this.$repository.refresh(_resource, ..._args);
        },
        $save(resource, ...args) {
            const { _resource, _args } = _parseResourceParams(this, resource, arguments);
            return "$id" in this.$repository ?
                this.$repository.$save(_resource, ..._args) :
                this.$repository.save(_resource, ..._args);
        },
        $saveAndRefresh(resource, ...args) {
            const { _resource, _args } = _parseResourceParams(this, resource, arguments);
            return "$id" in this.$repository ?
                this.$repository.$saveAndRefresh(_resource, ..._args) :
                this.$repository.saveAndRefresh(_resource, ..._args);
        },
        $delete(uri, ...args) {
            const { _uri, _args } = _parseURIParams(this, uri, arguments);
            return "$id" in this.$repository ?
                this.$repository.$delete(_uri, ..._args) :
                this.$repository.delete(_uri, ..._args);
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(ResolvablePointer.PROTOTYPE, object);
    },
    decorate(object) {
        if (ResolvablePointer.isDecorated(object))
            return object;
        const resource = ModelDecorator
            .decorateMultiple(object, Pointer);
        return ModelDecorator
            .definePropertiesFrom(ResolvablePointer.PROTOTYPE, resource);
    },
    is(value) {
        return Pointer.is(value)
            && ResolvablePointer.isDecorated(value);
    },
};

const QueryablePointer = {
    PROTOTYPE: {
        $_queryableMetadata: void 0,
        $isQueried() {
            return !!this.$_queryableMetadata;
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(QueryablePointer.PROTOTYPE, object);
    },
    decorate(object) {
        if (QueryablePointer.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, ResolvablePointer);
        return ModelDecorator
            .definePropertiesFrom(QueryablePointer.PROTOTYPE, target);
    },
    is(value) {
        return ResolvablePointer.is(value)
            && QueryablePointer.isDecorated(value);
    },
};

const TransientFragment = {
    PROTOTYPE: {
        get $registry() {
            throw new IllegalArgumentError(`Property "$registry" is required.`);
        },
        get $slug() {
            return URI.generateBNodeID();
        },
        get $id() {
            if (URI.isBNodeID(this.$slug))
                return this.$slug;
            return this.$document.$id + "#" + this.$slug;
        },
        set $id(value) {
            if (URI.isBNodeID(value))
                this.$slug = value;
            else
                this.$slug = URI.getFragment(value);
        },
        get $document() {
            return this.$registry;
        },
        set $document(document) {
            this.$registry = document;
        },
    },
    isDecorated(object) {
        return Resource.isDecorated(object);
    },
    decorate(object) {
        if (TransientFragment.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, Resource);
        if (!target.$registry)
            delete target.$registry;
        if (!target.$slug)
            delete target.$slug;
        return ModelDecorator
            .definePropertiesFrom(TransientFragment.PROTOTYPE, target);
    },
    is(value) {
        return Resource.is(value);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return TransientFragment.createFrom(copy);
    },
    createFrom(object) {
        return TransientFragment.decorate(object);
    },
};

const Fragment = {
    PROTOTYPE: {
        get $repository() {
            return this.$registry;
        },
        set $repository(document) {
            this.$registry = document;
        },
        get $_resolved() {
            return this.$document.$_resolved;
        },
        set $_resolved(_value) { },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(Fragment.PROTOTYPE, object);
    },
    decorate(object) {
        if (Fragment.isDecorated(object))
            return object;
        const forced = Object.assign(object, {
            $document: object.$registry,
            $repository: object.$registry,
        });
        const target = ModelDecorator
            .decorateMultiple(forced, TransientFragment, QueryablePointer);
        return ModelDecorator
            .definePropertiesFrom(Fragment.PROTOTYPE, target);
    },
    create: TransientFragment.create,
    createFrom: TransientFragment.createFrom,
};

const LDP = {
    namespace: "http://www.w3.org/ns/ldp#",
    Ascending: "http://www.w3.org/ns/ldp#Ascending",
    BasicContainer: "http://www.w3.org/ns/ldp#BasicContainer",
    Container: "http://www.w3.org/ns/ldp#Container",
    Descending: "http://www.w3.org/ns/ldp#Descending",
    DirectContainer: "http://www.w3.org/ns/ldp#DirectContainer",
    IndirectContainer: "http://www.w3.org/ns/ldp#IndirectContainer",
    RDFSource: "http://www.w3.org/ns/ldp#RDFSource",
    Resource: "http://www.w3.org/ns/ldp#Resource",
    MemberSubject: "http://www.w3.org/ns/ldp#MemberSubject",
    NonRDFSource: "http://www.w3.org/ns/ldp#NonRDFSource",
    Page: "http://www.w3.org/ns/ldp#Page",
    PageSortCriterion: "http://www.w3.org/ns/ldp#PageSortCriterion",
    PreferContainment: "http://www.w3.org/ns/ldp#PreferContainment",
    PreferEmptyContainer: "http://www.w3.org/ns/ldp#PreferEmptyContainer",
    PreferMembership: "http://www.w3.org/ns/ldp#PreferMembership",
    PreferMinimalContainer: "http://www.w3.org/ns/ldp#PreferMinimalContainer",
    constrainedBy: "http://www.w3.org/ns/ldp#constrainedBy",
    contains: "http://www.w3.org/ns/ldp#contains",
    hasMemberRelation: "http://www.w3.org/ns/ldp#hasMemberRelation",
    insertedContentRelation: "http://www.w3.org/ns/ldp#insertedContentRelation",
    isMemberOfRelation: "http://www.w3.org/ns/ldp#isMemberOfRelation",
    member: "http://www.w3.org/ns/ldp#member",
    membershipResource: "http://www.w3.org/ns/ldp#membershipResource",
    pageSequence: "http://www.w3.org/ns/ldp#pageSequence",
    pageSortCollation: "http://www.w3.org/ns/ldp#pageSortCollation",
    pageSortCriteria: "http://www.w3.org/ns/ldp#pageSortCriteria",
    pageSortOrder: "http://www.w3.org/ns/ldp#pageSortOrder",
};

var Event;
(function (Event) {
    Event["CHILD_CREATED"] = "child.created";
    Event["DOCUMENT_MODIFIED"] = "document.modified";
    Event["DOCUMENT_DELETED"] = "document.deleted";
    Event["MEMBER_ADDED"] = "member.added";
    Event["MEMBER_REMOVED"] = "member.removed";
})(Event || (Event = {}));

function __getLabelFrom(slug) {
    if (!isRelative(slug) || slug.startsWith("#"))
        return slug;
    return "#" + slug;
}
function __getObjectId(object) {
    if ("$id" in object)
        return object.$id;
    if ("$slug" in object)
        return URI.hasFragment(object.$slug) ?
            object.$slug : __getLabelFrom(object.$slug);
    return URI.generateBNodeID();
}
function __convertNested(resource, target, tracker = new Set()) {
    Object
        .keys(target)
        .map(key => target[key])
        .forEach(next => {
        if (Array.isArray(next))
            return __convertNested(resource, next, tracker);
        if (!isPlainObject(next))
            return;
        if (TransientDocument.is(next))
            return;
        if (next._registry && next._registry !== resource)
            return;
        const idOrSlug = __getObjectId(next);
        if (tracker.has(idOrSlug))
            return;
        if (!resource.$inScope(idOrSlug, true))
            return;
        const fragment = resource.$hasPointer(idOrSlug, true) ?
            resource.$getPointer(idOrSlug, true) :
            resource.$createFragment(next, idOrSlug);
        tracker.add(fragment.$id);
        __convertNested(resource, fragment, tracker);
    });
}
const TransientDocument = {
    PROTOTYPE: {
        $registry: void 0,
        $_normalize() {
            const usedFragments = new Set();
            __convertNested(this, this, usedFragments);
            this.$getPointers(true)
                .map(Pointer.getID)
                .filter(URI.isBNodeID)
                .filter(id => !usedFragments.has(id))
                .forEach(this.$removePointer, this);
        },
        $_getLocalID(id) {
            if (URI.isBNodeID(id))
                return id;
            if (URI.isFragmentOf(id, this.$id))
                return URI.getFragment(id);
            throw new IllegalArgumentError(`"${id}" is out of scope.`);
        },
        $getPointer(id, local) {
            id = URI.resolve(this.$id, id);
            return Registry.PROTOTYPE.getPointer.call(this, id, local);
        },
        $hasFragment(id) {
            id = __getLabelFrom(id);
            if (!this.$inScope(id, true))
                return false;
            const localID = this.$_getLocalID(id);
            return this.$__resourcesMap.has(localID);
        },
        $getFragment(id) {
            id = __getLabelFrom(id);
            const localID = this.$_getLocalID(id);
            const resource = this.$__resourcesMap.get(localID);
            if (!resource)
                return null;
            return resource;
        },
        $getFragments() {
            return this.$getPointers(true);
        },
        $createFragment(isOrObject, id) {
            const object = isObject(isOrObject) ? isOrObject : {};
            if (isString(isOrObject))
                id = isOrObject;
            const $id = id ? __getLabelFrom(id) : __getObjectId(object);
            const fragment = this.$_addPointer(Object
                .assign(object, { $id }));
            __convertNested(this, fragment);
            return fragment;
        },
        $removeFragment(fragmentOrSlug) {
            const id = __getLabelFrom(Pointer.getID(fragmentOrSlug));
            if (!this.$inScope(id, true))
                return false;
            return this.$removePointer(id);
        },
        toJSON(contextOrKey) {
            const nodes = [
                Resource.PROTOTYPE.toJSON.call(this, contextOrKey),
                ...this
                    .$getFragments()
                    .map(resource => resource.toJSON(contextOrKey)),
            ];
            return {
                "@id": this.$id,
                "@graph": nodes,
            };
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(TransientDocument.PROTOTYPE, object);
    },
    decorate(object) {
        if (TransientDocument.isDecorated(object))
            return object;
        const base = ModelDecorator.definePropertiesFrom({
            $__modelDecorator: TransientFragment,
        }, object);
        const resource = ModelDecorator
            .decorateMultiple(base, Resource, Registry);
        return ModelDecorator
            .definePropertiesFrom(TransientDocument.PROTOTYPE, resource);
    },
    is: (value) => Resource.is(value) &&
        Registry.isDecorated(value) &&
        TransientDocument.isDecorated(value),
    createFrom: (object) => {
        if (TransientDocument.is(object))
            throw new IllegalArgumentError("The object provided is already a Document.");
        const document = TransientDocument.decorate(object);
        __convertNested(document, document);
        return document;
    },
    create: (data) => {
        const copy = Object.assign({}, data);
        return TransientDocument.createFrom(copy);
    },
};

function __parseParams(resource, uriPatternOROnEvent, onEventOrOnError, onError) {
    const uriPattern = isString(uriPatternOROnEvent) ?
        URI.resolve(resource.$id, uriPatternOROnEvent) : resource.$id;
    const onEvent = isFunction(uriPatternOROnEvent) ?
        uriPatternOROnEvent : onEventOrOnError;
    if (onEvent !== onEventOrOnError)
        onError = onEventOrOnError;
    return { uriPattern, onEvent, onError };
}
const EventEmitterDocumentTrait = {
    PROTOTYPE: {
        $on(event, uriPatternOROnEvent, onEventOrOnError, onError) {
            const { uriPattern, onEvent, onError: $onError } = __parseParams(this, uriPatternOROnEvent, onEventOrOnError, onError);
            return this.$repository.on(event, uriPattern, onEvent, $onError);
        },
        $off(event, uriPatternOROnEvent, onEventOrOnError, onError) {
            const { uriPattern, onEvent, onError: $onError } = __parseParams(this, uriPatternOROnEvent, onEventOrOnError, onError);
            return this.$repository.off(event, uriPattern, onEvent, $onError);
        },
        $one(event, uriPatternOROnEvent, onEventOrOnError, onError) {
            const { uriPattern, onEvent, onError: $onError } = __parseParams(this, uriPatternOROnEvent, onEventOrOnError, onError);
            return this.$repository.one(event, uriPattern, onEvent, $onError);
        },
        $onChildCreated(uriPatternOROnEvent, onEventOrOnError, onError) {
            return this.$on(Event.CHILD_CREATED, uriPatternOROnEvent, onEventOrOnError, onError);
        },
        $onDocumentModified(uriPatternOROnEvent, onEventOrOnError, onError) {
            return this.$on(Event.DOCUMENT_MODIFIED, uriPatternOROnEvent, onEventOrOnError, onError);
        },
        $onDocumentDeleted(uriPatternOROnEvent, onEventOrOnError, onError) {
            return this.$on(Event.DOCUMENT_DELETED, uriPatternOROnEvent, onEventOrOnError, onError);
        },
        $onMemberAdded(uriPatternOROnEvent, onEventOrOnError, onError) {
            return this.$on(Event.MEMBER_ADDED, uriPatternOROnEvent, onEventOrOnError, onError);
        },
        $onMemberRemoved(uriPatternOROnEvent, onEventOrOnError, onError) {
            return this.$on(Event.MEMBER_REMOVED, uriPatternOROnEvent, onEventOrOnError, onError);
        },
    },
    isDecorated(object) {
        return isObject(object)
            && ModelDecorator
                .hasPropertiesFrom(EventEmitterDocumentTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (EventEmitterDocumentTrait.isDecorated(object))
            return object;
        const resource = ModelDecorator
            .decorateMultiple(object, TransientDocument, ResolvablePointer);
        return ModelDecorator
            .definePropertiesFrom(EventEmitterDocumentTrait.PROTOTYPE, resource);
    },
};

function __parseMemberParams(resource, args) {
    const params = Array.from(args);
    const uri = isString(params[0]) && isString(Pointer.getID(params[1])) ?
        URI.resolve(resource.$id, params.shift()) : resource.$id;
    return { uri, params };
}
const LDPDocumentTrait = {
    PROTOTYPE: {
        $create(uriOrChildren, childrenOrSlugsOrRequestOptions, slugsOrRequestOptions, requestOptions) {
            const { _uri, _args } = _parseURIParams(this, uriOrChildren, arguments);
            return this.$repository.create(_uri, ..._args);
        },
        $createAndRetrieve(uriOrChildren, childrenOrSlugsOrRequestOptions, slugsOrRequestOptions, requestOptions = {}) {
            const { _uri, _args } = _parseURIParams(this, uriOrChildren, arguments);
            return this.$repository.createAndRetrieve(_uri, ..._args);
        },
        $addMember(uriOrMember, memberOrOptions, requestOptions) {
            const { uri, params } = __parseMemberParams(this, arguments);
            return this.$repository.addMember(uri, ...params);
        },
        $addMembers(uriOrMembers, membersOrOptions, requestOptions) {
            const { _uri, _args } = _parseURIParams(this, uriOrMembers, arguments);
            return this.$repository.addMembers(_uri, ..._args);
        },
        $removeMember(uriOrMember, memberOrOptions, requestOptions) {
            const { uri, params } = __parseMemberParams(this, arguments);
            return this.$repository.removeMember(uri, ...params);
        },
        $removeMembers(uriOrMembersOrOptions, membersOrOptions, requestOptions) {
            const { _uri, _args } = _parseURIParams(this, uriOrMembersOrOptions, arguments);
            return this.$repository.removeMembers(_uri, ..._args);
        },
    },
    isDecorated(object) {
        return isObject(object)
            && ModelDecorator
                .hasPropertiesFrom(LDPDocumentTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (LDPDocumentTrait.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, TransientDocument, ResolvablePointer);
        return ModelDecorator
            .definePropertiesFrom(LDPDocumentTrait.PROTOTYPE, target);
    },
};

const QueryableDocumentTrait = {
    PROTOTYPE: {
        $get(uris, ...args) {
            if (!Array.isArray(uris))
                return ResolvablePointer.PROTOTYPE.$get.call(this, uris, ...args);
            const resolvedURIs = uris.map(uri => URI.resolve(this.$id, uri));
            return this.$repository.get(resolvedURIs, ...args);
        },
        $getChildren(uriOrQueryBuilderFnOrOptions, queryBuilderFnOrOptions, queryBuilderFn) {
            const { _uri, _args } = _parseURIParams(this, uriOrQueryBuilderFnOrOptions, arguments);
            return this.$repository.getChildren(_uri, ..._args);
        },
        $getMembers(uriOrQueryBuilderFnOrOptions, queryBuilderFnOrOptions, queryBuilderFn) {
            const { _uri, _args } = _parseURIParams(this, uriOrQueryBuilderFnOrOptions, arguments);
            return this.$repository.getMembers(_uri, ..._args);
        },
        $listChildren(uriOrOptions, requestOptions) {
            const { _uri, _args } = _parseURIParams(this, uriOrOptions, arguments);
            return this.$repository.listChildren(_uri, ..._args);
        },
        $listMembers(uriOrOptions, requestOptions) {
            const { _uri, _args } = _parseURIParams(this, uriOrOptions, arguments);
            return this.$repository.listMembers(_uri, ..._args);
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(QueryableDocumentTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (QueryableDocumentTrait.isDecorated(object))
            return object;
        const forced = object;
        const target = ModelDecorator
            .decorateMultiple(forced, LDPDocumentTrait, QueryablePointer);
        return ModelDecorator
            .definePropertiesFrom(QueryableDocumentTrait.PROTOTYPE, target);
    },
};

function __parseParams$1(resource, uriOrQuery, queryOrOptions, options) {
    let uri = resource.$id;
    let query = uriOrQuery;
    if (isObject(queryOrOptions)) {
        options = queryOrOptions;
    }
    else if (queryOrOptions !== void 0) {
        query = queryOrOptions;
        uri = URI.resolve(resource.$id, uriOrQuery);
    }
    return { uri, query, options };
}
const SPARQLDocumentTrait = {
    PROTOTYPE: {
        $executeASKQuery(uriOrQuery, queryOrOptions, requestOptions) {
            const { uri, query, options } = __parseParams$1(this, uriOrQuery, queryOrOptions, requestOptions);
            return this.$repository.executeASKQuery(uri, query, options);
        },
        $executeSELECTQuery(uriOrQuery, queryOrOptions, requestOptions) {
            const { uri, query, options } = __parseParams$1(this, uriOrQuery, queryOrOptions, requestOptions);
            return this.$repository.executeSELECTQuery(uri, query, options);
        },
        $executeUPDATE(uriOrQuery, updateOrOptions, requestOptions) {
            const { uri, query, options } = __parseParams$1(this, uriOrQuery, updateOrOptions, requestOptions);
            return this.$repository.executeUPDATE(uri, query, options);
        },
        $sparql(uri) {
            const $uri = uri ? URI.resolve(this.$id, uri) : this.$id;
            return this.$repository.sparql($uri);
        },
    },
    isDecorated(object) {
        return isObject(object)
            && ModelDecorator
                .hasPropertiesFrom(SPARQLDocumentTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (SPARQLDocumentTrait.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, TransientDocument, ResolvablePointer);
        return ModelDecorator
            .definePropertiesFrom(SPARQLDocumentTrait.PROTOTYPE, target);
    },
};

const Document = {
    TYPE: C.Document,
    SCHEMA: {
        "contains": {
            "@id": LDP.contains,
            "@container": "@set",
            "@type": "@id",
        },
        "members": {
            "@id": LDP.member,
            "@container": "@set",
            "@type": "@id",
        },
        "membershipResource": {
            "@id": LDP.membershipResource,
            "@type": "@id",
        },
        "isMemberOfRelation": {
            "@id": LDP.isMemberOfRelation,
            "@type": "@id",
        },
        "hasMemberRelation": {
            "@id": LDP.hasMemberRelation,
            "@type": "@id",
        },
        "insertedContentRelation": {
            "@id": LDP.insertedContentRelation,
            "@type": "@id",
        },
        "created": {
            "@id": C.created,
            "@type": XSD.dateTime,
        },
        "modified": {
            "@id": C.modified,
            "@type": XSD.dateTime,
        },
        "defaultInteractionModel": {
            "@id": C.defaultInteractionModel,
            "@type": "@id",
        },
        "accessPoints": {
            "@id": C.accessPoint,
            "@type": "@id",
            "@container": "@set",
        },
    },
    PROTOTYPE: {
        get $__savedFragments() { return []; },
        $_syncSavedFragments() {
            this.$__savedFragments = Array
                .from(this.$__resourcesMap.values());
            this.$__savedFragments
                .forEach(fragment => fragment.$_syncSnapshot());
        },
        $_syncSnapshot() {
            ResolvablePointer.PROTOTYPE.$_syncSnapshot.call(this);
            this.$_syncSavedFragments();
        },
        $isDirty() {
            const isSelfDirty = ResolvablePointer.PROTOTYPE.$isDirty.call(this);
            if (isSelfDirty)
                return true;
            const hasRemovedFragments = this
                .$__savedFragments
                .some(fragment => !this.$hasFragment(fragment.$id));
            if (hasRemovedFragments)
                return true;
            const hasNewFragments = this
                .$__savedFragments.length !== this.$__resourcesMap.size;
            if (hasNewFragments)
                return true;
            return this
                .$__savedFragments
                .some(fragment => fragment.$isDirty());
        },
        $revert() {
            ResolvablePointer.PROTOTYPE.$revert.call(this);
            this.$__resourcesMap.clear();
            this
                .$__savedFragments
                .forEach(fragment => {
                fragment.$revert();
                this.$__resourcesMap.set(fragment.$slug, fragment);
            });
        },
    },
    isDecorated(object) {
        return isObject(object)
            && ModelDecorator
                .hasPropertiesFrom(Document.PROTOTYPE, object);
    },
    is(object) {
        return TransientDocument.is(object)
            && SPARQLDocumentTrait.isDecorated(object)
            && EventEmitterDocumentTrait.isDecorated(object)
            && QueryableDocumentTrait.isDecorated(object)
            && Document.isDecorated(object);
    },
    decorate(object) {
        if (Document.isDecorated(object))
            return object;
        const base = Object.assign(object, {
            $__modelDecorator: Fragment,
        });
        const target = ModelDecorator
            .decorateMultiple(base, SPARQLDocumentTrait, EventEmitterDocumentTrait, QueryableDocumentTrait);
        return ModelDecorator
            .definePropertiesFrom(Document.PROTOTYPE, target);
    },
    create: TransientDocument.create,
    createFrom: TransientDocument.createFrom,
};

const TransientDirectContainer = {
    TYPE: LDP.DirectContainer,
    is(value) {
        return TransientDocument.is(value)
            && value.$hasType(TransientDirectContainer.TYPE)
            && value.hasOwnProperty("hasMemberRelation");
    },
    create(data) {
        const copy = Object.assign({}, data);
        return TransientDirectContainer.createFrom(copy);
    },
    createFrom(object) {
        if (TransientDirectContainer.is(object))
            throw new IllegalArgumentError("The base object is already a DirectContainer.");
        if (!object.hasMemberRelation)
            throw new IllegalArgumentError("The property hasMemberRelation is required.");
        const container = TransientDocument.is(object) ?
            object : TransientDocument.createFrom(object);
        container.$addType(TransientDirectContainer.TYPE);
        return container;
    },
};

const TransientAccessPoint = {
    TYPE: C.AccessPoint,
    is(value) {
        return TransientDirectContainer.is(value);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return TransientAccessPoint.createFrom(copy);
    },
    createFrom(object) {
        const accessPoint = TransientDirectContainer
            .createFrom(object);
        accessPoint
            .$addType(TransientAccessPoint.TYPE);
        return accessPoint;
    },
};

const AccessPoint = {
    TYPE: TransientAccessPoint.TYPE,
    is: (value) => TransientAccessPoint.is(value)
        && Document.is(value),
    create: TransientAccessPoint.create,
    createFrom: TransientAccessPoint.createFrom,
};

const ModelSchema = {
    is(object) {
        return "TYPE" in object
            && "SCHEMA" in object;
    },
};

class AbstractContext {
    constructor(parentContext) {
        this._parentContext = parentContext;
        this._typeObjectSchemaMap = new Map();
        this.jsonldConverter = new JSONLDConverter(parentContext && parentContext.jsonldConverter.literalSerializers);
    }
    get baseURI() { return this._baseURI; }
    get parentContext() { return this._parentContext; }
    resolve(relativeURI) {
        return URI.resolve(this.baseURI, relativeURI);
    }
    hasObjectSchema(type) {
        type = this.__resolveTypeURI(type);
        if (this._typeObjectSchemaMap.has(type))
            return true;
        return !!this.parentContext && this.parentContext.hasObjectSchema(type);
    }
    getObjectSchema(type) {
        if (!!type) {
            type = this.__resolveTypeURI(type);
            if (this._typeObjectSchemaMap.has(type))
                return this._typeObjectSchemaMap.get(type);
            if (this.parentContext && this.parentContext.hasObjectSchema(type))
                return this.parentContext.getObjectSchema(type);
            throw new IllegalArgumentError(`"${type}" hasn't an object schema.`);
        }
        else {
            const generalSchema = !this._generalObjectSchema ?
                this.parentContext ?
                    this.parentContext.getObjectSchema() :
                    new DigestedObjectSchema() :
                ObjectSchemaDigester
                    .combineDigestedObjectSchemas([this._generalObjectSchema]);
            if (generalSchema.vocab === void 0 && this._settings && this._settings.vocabulary)
                generalSchema.vocab = this.resolve(this._settings.vocabulary);
            if (!generalSchema.base)
                generalSchema.base = this.baseURI;
            return generalSchema;
        }
    }
    extendObjectSchema(objectSchemaOrTypeOrModelSchema, objectSchema) {
        if (isString(objectSchemaOrTypeOrModelSchema)) {
            if (!objectSchema)
                throw new IllegalArgumentError(`An object schema is required.`);
            return this.__extendTypeSchema(objectSchema, objectSchemaOrTypeOrModelSchema);
        }
        if (ModelSchema.is(objectSchemaOrTypeOrModelSchema))
            return this.__extendTypeSchema(objectSchemaOrTypeOrModelSchema.SCHEMA, objectSchemaOrTypeOrModelSchema.TYPE);
        if (Array.isArray(objectSchemaOrTypeOrModelSchema)) {
            objectSchemaOrTypeOrModelSchema.forEach(this.extendObjectSchema, this);
            return this;
        }
        return this.__extendGeneralSchema(objectSchemaOrTypeOrModelSchema);
    }
    clearObjectSchema(type) {
        if (type === void 0) {
            this._generalObjectSchema = this.parentContext ? undefined : new DigestedObjectSchema();
        }
        else {
            type = this.__resolveTypeURI(type);
            this._typeObjectSchemaMap.delete(type);
        }
    }
    _getTypeObjectSchemas(excepts = []) {
        const exceptsSet = new Set(excepts);
        const types = this
            .__getObjectSchemasTypes()
            .filter(type => !exceptsSet.has(type));
        return types.map(this.getObjectSchema, this);
    }
    __getObjectSchemasTypes() {
        const localTypes = [];
        this._typeObjectSchemaMap
            .forEach((_, key) => localTypes.push(key));
        if (!this._parentContext)
            return localTypes;
        const allTypes = this._parentContext.__getObjectSchemasTypes();
        for (const type of localTypes) {
            if (allTypes.indexOf(type) !== -1)
                continue;
            allTypes.push(type);
        }
        return allTypes;
    }
    __extendGeneralSchema(objectSchema) {
        const digestedSchemaToExtend = this.__getInheritGeneralSchema();
        this._generalObjectSchema = ObjectSchemaDigester._combineSchemas([
            digestedSchemaToExtend,
            ObjectSchemaDigester.digestSchema(objectSchema),
        ]);
        return this;
    }
    __extendTypeSchema(objectSchema, type) {
        type = this.__resolveTypeURI(type);
        const digestedSchemaToExtend = this.__getInheritTypeSchema(type);
        const extendedDigestedSchema = ObjectSchemaDigester
            .combineDigestedObjectSchemas([
            digestedSchemaToExtend,
            ObjectSchemaDigester.digestSchema(objectSchema),
        ]);
        this._typeObjectSchemaMap
            .set(type, extendedDigestedSchema);
        return this;
    }
    __getInheritGeneralSchema() {
        if (this._generalObjectSchema)
            return this._generalObjectSchema;
        if (this.parentContext)
            return this.parentContext.getObjectSchema();
        return new DigestedObjectSchema();
    }
    __getInheritTypeSchema(type) {
        if (this._typeObjectSchemaMap.has(type))
            return this._typeObjectSchemaMap.get(type);
        if (this.parentContext && this.parentContext.hasObjectSchema(type))
            return this.parentContext.getObjectSchema(type);
        return new DigestedObjectSchema();
    }
    __resolveTypeURI(uri) {
        return this.getObjectSchema()
            .resolveURI(uri, { vocab: true });
    }
}

function __getSchemaForNode($context, node) {
    const types = RDFNode.getTypes(node);
    return __getSchema($context, types, node["@id"]);
}
function __getSchemaForResource($context, resource) {
    const types = resource.types || [];
    return __getSchema($context, types, resource.$id);
}
function __getSchema($context, objectTypes, objectID) {
    if (!$context)
        return new DigestedObjectSchema();
    if (objectID !== void 0 && !URI.hasFragment(objectID) && !URI.isBNodeID(objectID) && objectTypes.indexOf(C.Document) === -1)
        objectTypes = objectTypes.concat(C.Document);
    const objectSchemas = objectTypes
        .filter(type => $context.hasObjectSchema(type))
        .map(type => $context.getObjectSchema(type));
    return ObjectSchemaDigester
        ._combineSchemas([
        $context.getObjectSchema(),
        ...objectSchemas,
    ]);
}
const ObjectSchemaResolver = {
    PROTOTYPE: {
        context: undefined,
        getGeneralSchema() {
            if (!this.context)
                return new DigestedObjectSchema();
            return this.context.getObjectSchema();
        },
        hasSchemaFor(object, path) {
            return !path;
        },
        getSchemaFor(object) {
            return "types" in object || "$id" in object ?
                __getSchemaForResource(this.context, object) :
                __getSchemaForNode(this.context, object);
        },
    },
    isDecorated(object) {
        return ModelDecorator.hasPropertiesFrom(ObjectSchemaResolver.PROTOTYPE, object);
    },
    decorate(object) {
        return ModelDecorator.definePropertiesFrom(ObjectSchemaResolver.PROTOTYPE, object);
    },
};

const GeneralRegistry = {
    PROTOTYPE: {
        get context() {
            throw new IllegalArgumentError("Property context is required.");
        },
        get registry() {
            if (!this.context || !this.context.parentContext)
                return;
            return this.context.parentContext.registry;
        },
        set registry(value) { },
        get __modelDecorators() { return new Map(); },
        addDecorator(decorator) {
            if (!decorator.TYPE)
                throw new IllegalArgumentError("No TYPE specified in the model decorator.");
            this.__modelDecorators.set(decorator.TYPE, decorator);
            return this;
        },
        decorate(object) {
            if (!object.types)
                return;
            object.types
                .filter(type => this.__modelDecorators.has(type))
                .map(type => this.__modelDecorators.get(type))
                .forEach(decorator => decorator.decorate(object));
        },
        _addPointer(pointer) {
            if (this.context.repository)
                Object.assign(pointer, { $repository: this.context.repository });
            const resource = Registry.PROTOTYPE._addPointer.call(this, pointer);
            resource.$id = this.context.getObjectSchema().resolveURI(resource.$id, { base: true });
            return resource;
        },
        _getLocalID(id) {
            const uri = this.context.getObjectSchema().resolveURI(id, { base: true });
            if (!URI.isAbsolute(uri) || !URI.isBaseOf(this.context.baseURI, uri))
                throw new IllegalArgumentError(`"${uri}" is out of scope.`);
            return URI.getRelativeURI(uri, this.context.baseURI);
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(GeneralRegistry.PROTOTYPE, object);
    },
    decorate(object) {
        if (GeneralRegistry.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, Registry, ObjectSchemaResolver);
        if (!target.context)
            delete target.context;
        return ModelDecorator
            .definePropertiesFrom(GeneralRegistry.PROTOTYPE, target);
    },
    create(data) {
        return GeneralRegistry.createFrom(Object.assign({}, data));
    },
    createFrom(object) {
        const registry = GeneralRegistry.decorate(object);
        if (registry.registry)
            MapUtils.extend(registry.__modelDecorators, registry.registry.__modelDecorators);
        return registry;
    },
};

const DocumentsRegistry = {
    PROTOTYPE: {
        register(id) {
            return this.getPointer(id, true);
        },
        _getLocalID(id) {
            if (URI.hasFragment(id))
                throw new IllegalArgumentError(`"${id}" is out of scope.`);
            return GeneralRegistry.PROTOTYPE._getLocalID.call(this, id);
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(DocumentsRegistry.PROTOTYPE, object);
    },
    decorate(object) {
        if (DocumentsRegistry.isDecorated(object))
            return object;
        const base = Object.assign(object, {
            __modelDecorator: Document,
        });
        const target = ModelDecorator
            .decorateMultiple(base, GeneralRegistry);
        return ModelDecorator
            .definePropertiesFrom(DocumentsRegistry.PROTOTYPE, target);
    },
    create(data) {
        return DocumentsRegistry.createFrom(Object.assign({}, data));
    },
    createFrom(object) {
        const registry = DocumentsRegistry.decorate(object);
        return GeneralRegistry.createFrom(registry);
    },
};

function __throwNotImplemented() {
    return Promise.reject(new NotImplementedError("Must be implemented for a specific repository implementation."));
}
const Repository = {
    PROTOTYPE: {
        get: __throwNotImplemented,
        resolve: __throwNotImplemented,
        exists: __throwNotImplemented,
        refresh: __throwNotImplemented,
        save: __throwNotImplemented,
        saveAndRefresh: __throwNotImplemented,
        delete: __throwNotImplemented,
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(Repository.PROTOTYPE, object);
    },
    decorate(object) {
        if (Repository.isDecorated(object))
            return;
        return ModelDecorator
            .definePropertiesFrom(Repository.PROTOTYPE, object);
    },
};

const GeneralRepository = {
    PROTOTYPE: {
        get context() {
            throw new IllegalArgumentError(`Property "context" is required.`);
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(GeneralRepository.PROTOTYPE, object);
    },
    decorate(object) {
        if (GeneralRepository.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, Repository);
        return ModelDecorator
            .definePropertiesFrom(GeneralRepository.PROTOTYPE, target);
    },
    create(data) {
        return GeneralRepository.createFrom(Object.assign({}, data));
    },
    createFrom(object) {
        return GeneralRepository.decorate(object);
    },
};

function _validateEventType(event) {
    if (!/(access-point|child|\*)\.(created|\*)|(document|\*)\.(modified|deleted|\*)|(member|\*)\.(added|removed|\*)/.test(event))
        throw new IllegalArgumentError(`Provided event type "${event}" is invalid.`);
}
function _parseURIPattern(uriPattern, baseURI) {
    if (!URI.isBaseOf(baseURI, uriPattern))
        throw new IllegalArgumentError(`"${uriPattern}" is out of scope.`);
    if (uriPattern === "/")
        return "";
    uriPattern = URI.getRelativeURI(uriPattern, baseURI);
    uriPattern = uriPattern.substring(+uriPattern.startsWith("/"), uriPattern.length - +uriPattern.endsWith("/"));
    return uriPattern
        .split("/")
        .map(slug => {
        if (slug === "**")
            return "#";
        return encodeURIComponent(slug)
            .replace(/\./g, "^");
    }).join(".");
}
function _createDestination(event, uriPattern, baseURI) {
    _validateEventType(event);
    uriPattern = _parseURIPattern(uriPattern, baseURI);
    return `/topic/${event}${uriPattern ? "." + uriPattern : uriPattern}`;
}

const EventEmitterDocumentsRepositoryTrait = {
    PROTOTYPE: {
        on(event, uriPattern, onEvent, onError) {
            try {
                const destination = _createDestination(event, uriPattern, this.context.baseURI);
                this.context.messaging.subscribe(destination, onEvent, onError);
            }
            catch (error) {
                if (!onError)
                    throw error;
                onError(error);
            }
        },
        off(event, uriPattern, onEvent, onError) {
            try {
                const destination = _createDestination(event, uriPattern, this.context.baseURI);
                this.context.messaging.unsubscribe(destination, onEvent);
            }
            catch (error) {
                if (!onError)
                    throw error;
                onError(error);
            }
        },
        one(event, uriPattern, onEvent, onError) {
            try {
                const destination = _createDestination(event, uriPattern, this.context.baseURI);
                const onEventWrapper = message => {
                    onEvent(message);
                    this.context.messaging.unsubscribe(destination, onEventWrapper);
                };
                this.context.messaging.subscribe(destination, onEventWrapper, onError);
            }
            catch (error) {
                if (!onError)
                    throw error;
                onError(error);
            }
        },
        onChildCreated(uriPattern, onEvent, onError) {
            return this.on(Event.CHILD_CREATED, uriPattern, onEvent, onError);
        },
        onDocumentModified(uriPattern, onEvent, onError) {
            return this.on(Event.DOCUMENT_MODIFIED, uriPattern, onEvent, onError);
        },
        onDocumentDeleted(uriPattern, onEvent, onError) {
            return this.on(Event.DOCUMENT_DELETED, uriPattern, onEvent, onError);
        },
        onMemberAdded(uriPattern, onEvent, onError) {
            return this.on(Event.MEMBER_ADDED, uriPattern, onEvent, onError);
        },
        onMemberRemoved(uriPattern, onEvent, onError) {
            return this.on(Event.MEMBER_REMOVED, uriPattern, onEvent, onError);
        },
    },
    isDecorated(object) {
        return isObject(object)
            && ModelDecorator
                .hasPropertiesFrom(EventEmitterDocumentsRepositoryTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (EventEmitterDocumentsRepositoryTrait.isDecorated(object))
            return object;
        const resource = ModelDecorator
            .decorateMultiple(object, GeneralRepository);
        return ModelDecorator
            .definePropertiesFrom(EventEmitterDocumentsRepositoryTrait.PROTOTYPE, resource);
    },
};

class BaseToken {
    constructor(iri) {
        this.token = "base";
        this.iri = iri;
    }
    toString() {
        return `BASE ${this.iri}`;
    }
}

class BindToken {
    constructor(expression, variable) {
        this.token = "bind";
        this.expression = expression;
        this.variable = variable;
    }
    toString(spaces) {
        return `BIND(${this.expression} AS ${this.variable})`;
    }
}

const INDENTATION_SPACES = 4;
function getSeparator(spaces) {
    if (spaces === void 0)
        return " ";
    return "\n";
}
function getIndentation(spaces, extra) {
    if (spaces === void 0)
        return "";
    if (extra)
        spaces += extra;
    return " ".repeat(spaces);
}
function addSpaces(spaces, extra) {
    if (spaces === void 0)
        return spaces;
    return spaces + extra;
}
function getTokenContainerString({ spaces, tags, tokensSeparator, tokens }) {
    if (!tokens.length)
        return tags.open + tags.close;
    const generalSeparator = getSeparator(spaces);
    const tokensSpaces = addSpaces(spaces, INDENTATION_SPACES);
    const strArrayTokens = tokens.map((token, index, array) => {
        const strToken = token.toString(tokensSpaces);
        if (!tokensSeparator || index === array.length - 1)
            return strToken;
        if (tokensSeparator === "." && token.token !== "subject")
            return strToken;
        return strToken + tokensSeparator;
    });
    if (strArrayTokens.length === 1 && !strArrayTokens[0].includes("\n"))
        return tags.open + " " + strArrayTokens + " " + tags.close;
    const tokensIndent = getIndentation(tokensSpaces);
    const strTokens = strArrayTokens
        .map(x => tokensIndent + x)
        .join(generalSeparator);
    const indent = getIndentation(spaces);
    return tags.open +
        generalSeparator + strTokens + generalSeparator +
        indent + tags.close;
}

class BlankNodePropertyToken {
    constructor() {
        this.token = "blankNodeProperty";
        this.properties = [];
    }
    addProperty(property) {
        this.properties.push(property);
        return this;
    }
    toString(spaces) {
        return getTokenContainerString({
            spaces,
            tags: { open: "[", close: "]" },
            tokensSeparator: ";",
            tokens: this.properties,
        });
    }
}

const LABEL_REGEX = /^_:[A-Za-z0-9_]([A-Za-z0-9_\-.]*[A-Za-z0-9_\-])?$/;
class BlankNodeToken {
    constructor(label) {
        this.token = "blankNode";
        if (!label)
            return;
        if (!LABEL_REGEX.test(label))
            throw new Error("Invalid blank node label.");
        this.label = label;
    }
    toString(spaces) {
        if (this.label)
            return this.label;
        return `[]`;
    }
}

class CollectionToken {
    constructor() {
        this.token = "collection";
        this.objects = [];
    }
    addObject(...object) {
        this.objects.push(...object);
        return this;
    }
    toString(spaces) {
        return getTokenContainerString({
            spaces,
            tags: { open: "(", close: ")" },
            tokens: this.objects,
        });
    }
}

class GroupPatternToken {
    constructor() {
        this.token = "groupPattern";
        this.patterns = [];
    }
    addPattern(...patterns) {
        this.patterns.push(...patterns);
        return this;
    }
    toString(spaces) {
        return getTokenContainerString({
            spaces,
            tags: { open: "{", close: "}" },
            tokensSeparator: ".",
            tokens: this.patterns,
        });
    }
}

class WhereToken {
    constructor() {
        this.token = "where";
        this.groupPattern = new GroupPatternToken();
    }
    toString(spaces) {
        const identifier = spaces === void 0 ? "" : "WHERE ";
        return identifier + this.groupPattern.toString(spaces);
    }
}

class SharedQueryClauseToken {
    constructor() {
        this.where = new WhereToken();
        this.modifiers = [];
    }
    addPattern(...patterns) {
        this.where.groupPattern.patterns.push(...patterns);
        return this;
    }
    addModifier(...modifier) {
        this.modifiers.push(...modifier);
        return this;
    }
}

class ConstructToken extends SharedQueryClauseToken {
    constructor() {
        super();
        this.token = "construct";
        this.triples = [];
    }
    addTriple(...triple) {
        this.triples.push(...triple);
        return this;
    }
    toString(spaces) {
        const triples = getTokenContainerString({
            spaces,
            tags: { open: "{", close: "}" },
            tokensSeparator: ".",
            tokens: this.triples,
        });
        const separator = getSeparator(spaces);
        let query = `CONSTRUCT ` +
            triples + separator +
            this.where.toString(spaces);
        if (this.modifiers.length)
            query += separator + this.modifiers.join(separator);
        return query;
    }
}

class FilterToken {
    constructor(constraint) {
        this.token = "filter";
        this.constraint = constraint;
    }
    toString(spaces) {
        return `FILTER( ${this.constraint} )`;
    }
}

class FromToken {
    constructor(source, named = false) {
        this.token = "from";
        this.source = source;
        this.named = named;
    }
    toString(spaces) {
        let str = `FROM `;
        if (this.named)
            str += `NAMED `;
        return str + this.source;
    }
}

class GraphToken {
    constructor(graph) {
        this.token = "graph";
        this.graph = graph;
        this.groupPattern = new GroupPatternToken();
    }
    addPattern(...pattern) {
        this.groupPattern.patterns.push(...pattern);
        return this;
    }
    toString(spaces) {
        return `GRAPH ${this.graph} ${this.groupPattern.toString(spaces)}`;
    }
}

class GroupToken {
    constructor(rawCondition) {
        this.token = "group";
        this.rawCondition = rawCondition;
    }
    toString(spaces) {
        return `GROUP BY ${this.rawCondition}`;
    }
}

class HavingToken {
    constructor(rawCondition) {
        this.token = "having";
        this.rawCondition = rawCondition;
    }
    toString(spaces) {
        return `HAVING ${this.rawCondition}`;
    }
}

class IRIRefToken {
    constructor(value) {
        this.token = "iri";
        this.value = value;
    }
    toString(spaces) {
        return `<${this.value}>`;
    }
}

const LANGUAGE_REGEX = /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/;
class LanguageToken {
    constructor(tag) {
        this.token = "language";
        if (!LANGUAGE_REGEX.test(tag))
            throw new Error(`"${tag}" is an invalid language tag.`);
        this.tag = tag;
    }
    toString(spaces) {
        return `@${this.tag}`;
    }
}

class LimitToken {
    constructor(value) {
        this.token = "limit";
        this.value = value;
    }
    toString() {
        return `LIMIT ${this.value}`;
    }
}

class LiteralToken {
    constructor(value) {
        this.token = "literal";
        this.value = value;
    }
    toString(spaces) {
        return JSON.stringify(this.value);
    }
}

class MinusPatternToken {
    constructor() {
        this.token = "minusPattern";
        this.groupPattern = new GroupPatternToken();
    }
    toString(spaces) {
        return `MINUS ${this.groupPattern.toString(spaces)}`;
    }
}

class OffsetToken {
    constructor(value) {
        this.token = "offset";
        this.value = value;
    }
    toString(spaces) {
        return `OFFSET ${this.value}`;
    }
}

class OptionalToken {
    constructor() {
        this.token = "optional";
        this.groupPattern = new GroupPatternToken();
    }
    addPattern(...pattern) {
        this.groupPattern.patterns.push(...pattern);
        return this;
    }
    toString(spaces) {
        return `OPTIONAL ${this.groupPattern.toString(spaces)}`;
    }
}

class OrderToken {
    constructor(condition, flow) {
        this.token = "order";
        this.condition = condition;
        if (flow)
            this.flow = flow;
    }
    toString(spaces) {
        return "ORDER BY " + (this.flow ?
            `${this.flow}( ${this.condition} )` :
            `${this.condition}`);
    }
}

class PathAlternativeToken {
    constructor() {
        this.token = "pathAlternative";
        this.paths = [];
    }
    addPath(path) {
        this.paths.push(path);
        return this;
    }
    toString() {
        return this.paths
            .join("|");
    }
}

class PathInverseToken {
    constructor(path) {
        this.token = "pathInverse";
        this.path = path;
    }
    toString() {
        return `^${this.path}`;
    }
}

class PathModToken {
    constructor(path, mod) {
        this.token = "pathMod";
        this.path = path;
        this.mod = mod;
    }
    toString() {
        return `${this.path}${this.mod}`;
    }
}

class PathNegatedToken {
    constructor(path) {
        this.token = "pathNegated";
        this.path = path;
    }
    toString() {
        return `!${this.path}`;
    }
}

class PathSequenceToken {
    constructor() {
        this.token = "pathSequence";
        this.paths = [];
    }
    addPath(path) {
        this.paths.push(path);
        return this;
    }
    toString() {
        return this.paths
            .join("/");
    }
}

const NAMESPACE_REGEX = /^([A-Za-z](([A-Za-z_\-0-9]|\.)*[A-Za-z_\-0-9])?)?$/;
class PrefixedNameToken {
    constructor(prefixedOrNamespace, localName) {
        this.token = "prefixedName";
        let namespace = prefixedOrNamespace;
        if (localName === void 0) {
            if (!isPrefixed(prefixedOrNamespace))
                throw new Error("Invalid prefixed name.");
            [namespace, localName] = prefixedOrNamespace.split(/:(.*)/);
        }
        if (!NAMESPACE_REGEX.test(namespace))
            throw new Error("Invalid prefixed namespace.");
        this.namespace = namespace;
        const [, ln1, ln2, ln3] = localName.split(/^(.)(?:(.*)?(.))?$/);
        let preSanitation = "";
        if (ln1)
            preSanitation += ln1.replace(/([\-.])/g, "\\$1");
        if (ln2)
            preSanitation += ln2;
        if (ln3)
            preSanitation += ln3.replace(/([.])/g, "\\$1");
        this.localName = preSanitation.replace(/([~!$&'|()*+,;=/?#@%])/g, "\\$1");
    }
    toString(spaces) {
        return `${this.namespace}:${this.localName}`;
    }
}

class PrefixToken {
    constructor(namespace, iri) {
        this.token = "prefix";
        this.namespace = namespace;
        this.iri = iri;
    }
    toString(spaces) {
        return `PREFIX ${this.namespace}: ${this.iri}`;
    }
}

class PropertyToken {
    constructor(verb) {
        this.token = "property";
        this.verb = verb;
        this.objects = [];
    }
    addObject(...object) {
        this.objects.push(...object);
        return this;
    }
    toString(spaces) {
        const separator = getSeparator(spaces);
        const verb = `${this.verb}`;
        const objectSpaces = addSpaces(spaces, verb.length + 1);
        const objectIndent = getIndentation(objectSpaces);
        const objects = this.objects
            .map(object => {
            if (object.token === "collection" || object.token === "blankNodeProperty")
                return object.toString(spaces);
            return object.toString(objectSpaces);
        })
            .join("," + separator + objectIndent);
        return verb + " " + objects;
    }
}

class QueryToken {
    constructor(query, values) {
        this.token = "query";
        this.prologues = [];
        this.queryClause = query;
        this.values = values;
    }
    addPrologues(...prologues) {
        this.prologues.push(...prologues);
        return this;
    }
    toString(spaces) {
        const separator = getSeparator(spaces);
        let query = this.prologues
            .map(prologue => {
            if (prologue.token === "base")
                return prologue + "\n";
            return prologue + separator;
        })
            .join("");
        if (this.queryClause)
            query += this.queryClause.toString(spaces);
        if (this.values)
            query += separator + this.values.toString(spaces);
        return query;
    }
}

class RDFLiteralToken extends LiteralToken {
    constructor(value, typeOrLanguage) {
        super(value);
        if (!typeOrLanguage)
            return;
        if (typeOrLanguage.token === "language") {
            this.language = typeOrLanguage;
        }
        else {
            this.type = typeOrLanguage;
        }
    }
    toString(spaces) {
        const value = super.toString();
        if (this.language)
            return value + this.language;
        if (this.type)
            return `${value}^^${this.type}`;
        return value;
    }
}

class SharedSelectToken extends SharedQueryClauseToken {
    constructor(modifier) {
        super();
        this.modifier = modifier;
        this.variables = [];
    }
    addVariable(...variables) {
        this.variables.push(...variables);
        return this;
    }
    toString(spaces) {
        let query = `SELECT`;
        if (this.modifier)
            query += ` ${this.modifier}`;
        query += this.variables.length ?
            ` ${this.variables.join(" ")}` :
            " *";
        return query;
    }
}

class SelectToken extends SharedSelectToken {
    constructor(modifier) {
        super(modifier);
        this.token = "select";
        this.datasets = [];
    }
    toString(spaces) {
        let query = super.toString(spaces);
        const separator = getSeparator(spaces);
        if (this.datasets.length)
            query += separator + this.datasets.join(separator);
        query += separator + this.where.toString(spaces);
        if (this.modifiers.length)
            query += separator + this.modifiers.join(separator);
        return query;
    }
}

class ServicePatternToken {
    constructor(resource, modifier) {
        this.token = "servicePattern";
        this.modifier = modifier;
        this.resource = resource;
        this.groupPattern = new GroupPatternToken();
    }
    toString(spaces) {
        let query = `SERVICE `;
        if (this.modifier)
            query += `SILENT `;
        query += `${this.resource} ${this.groupPattern.toString(spaces)}`;
        return query;
    }
}

class SubjectToken {
    constructor(subject) {
        this.token = "subject";
        this.subject = subject;
        this.properties = [];
    }
    addProperty(property) {
        this.properties.push(property);
        return this;
    }
    toString(spaces) {
        let query = this.subject.toString(spaces);
        let separator = !this.properties.length ? ""
            : (this.subject.token === "collection" || this.subject.token === "blankNodeProperty")
                && query.includes("\n") ? "\n"
                : " ";
        const subSpaces = separator === " " ?
            addSpaces(spaces, query.length + 1) :
            addSpaces(spaces, INDENTATION_SPACES);
        const subIndent = getIndentation(subSpaces);
        const properties = this.properties
            .map(property => property.toString(subSpaces))
            .join(";" + getSeparator(spaces) + subIndent);
        if (separator === "\n")
            separator += subIndent;
        return query + separator + properties;
    }
}

class SubSelectToken extends SharedSelectToken {
    constructor(modifier, values) {
        super(modifier);
        this.token = "subSelect";
        this.values = values;
    }
    toString(spaces) {
        const subSpaces = addSpaces(spaces, INDENTATION_SPACES);
        const subIndent = getIndentation(subSpaces);
        const separator = getSeparator(spaces);
        let query = super.toString(spaces) + separator +
            subIndent + this.where.toString(subSpaces);
        if (this.modifiers.length)
            query += separator + this.modifiers
                .map(x => subIndent + x)
                .join(separator);
        if (this.values)
            query += separator + subIndent + this.values;
        const indent = getIndentation(spaces);
        return "{" + separator + subIndent +
            query + separator +
            indent + "}";
    }
}

class UnionPatternToken {
    constructor() {
        this.token = "unionPattern";
        this.groupPatterns = [];
    }
    toString(spaces) {
        return this
            .groupPatterns
            .map(x => x.toString(spaces))
            .join(` UNION `);
    }
}

class ValuesToken {
    constructor() {
        this.token = "values";
        this.variables = [];
        this.values = [];
    }
    addVariables(...variables) {
        this.variables.push(...variables);
        return this;
    }
    addValues(...values) {
        this.values.push(values);
        return this;
    }
    toString(spaces) {
        const variables = this._getVariablesStr();
        const values = this._getValuesStr(spaces);
        return `VALUES ${variables} ${values}`;
    }
    _getVariablesStr() {
        if (!this.variables.length)
            return "()";
        const variables = this.variables.join(" ");
        if (this.variables.length === 1)
            return variables;
        return `( ${variables} )`;
    }
    _getValuesStr(spaces) {
        if (!this.values.length)
            return "{}";
        if (this.variables.length === 1) {
            const values = this.values
                .filter(x => x.length)
                .map(x => x[0])
                .join(" ");
            if (!values)
                return "{}";
            return "{ " + values + " }";
        }
        const subIndent = getIndentation(spaces, INDENTATION_SPACES);
        const separator = getSeparator(spaces);
        const indent = getIndentation(spaces);
        return "{" + separator +
            this.values
                .map(values => {
                const valuesStr = values.length ?
                    `( ${values.join(" ")} )` : "()";
                return subIndent + valuesStr;
            })
                .join(separator) + separator +
            indent + "}";
    }
}

const NAME_REGEX = /^((?:[0-9A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF]))((?:[0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF]))*$/;
class VariableToken {
    constructor(name) {
        this.token = "variable";
        if (!NAME_REGEX.test(name))
            throw new Error("Invalid variable name");
        this.name = name;
    }
    toString(spaces) {
        return `?${this.name}`;
    }
}

class IllegalStateError extends AbstractError {
    get name() { return "IllegalStateError"; }
    constructor(message = "") {
        super(message);
    }
}

class Container {
    constructor(data) {
        this.iriResolver = data.iriResolver;
        this.targetToken = data.targetToken;
        if (new.target === Container)
            Object.freeze(this);
    }
}

const Factory = {
    createFrom(...factories) {
        return (container, object) => {
            return factories
                .reduce((target, factoryFn) => factoryFn(container, target), object);
        };
    }
};

class IRIResolver {
    constructor(base, vocab) {
        this.prefixes = base
            ? new Map(base.prefixes.entries())
            : new Map();
        this.vocab = vocab
            ? vocab
            : base && base.vocab;
        if (new.target === IRIResolver)
            Object.freeze(this);
    }
    resolve(relativeIRI, vocab) {
        if (isPrefixed(relativeIRI))
            return this.resolvePrefixed(relativeIRI);
        return this.resolveIRIRef(relativeIRI, vocab);
    }
    resolveIRIRef(relativeIRI, vocab = false) {
        if (vocab && this.vocab && isRelative(relativeIRI))
            relativeIRI = this.vocab + relativeIRI;
        return new IRIRefToken(relativeIRI);
    }
    resolvePrefixed(prefixedName) {
        let token = new PrefixedNameToken(prefixedName);
        const used = this.prefixes.get(token.namespace);
        if (used === void 0)
            throw new Error(`The prefix "${token.namespace}" has not been declared.`);
        if (!used)
            this.prefixes.set(token.namespace, true);
        return token;
    }
}

class QueryUnitContainer extends Container {
    constructor(data) {
        super(data);
        this.selectFinishClauseFactory = data.selectFinishClauseFactory;
        this.askFinishClauseFactory = data.askFinishClauseFactory;
        if (new.target === QueryUnitContainer)
            Object.freeze(this);
    }
}

const FinishClause = {
    createFrom(container, object) {
        const toPrettyString = () => container.targetToken.toString(0);
        const debug = debugFn => {
            debugFn.call(void 0, object, container);
            return object;
        };
        return Object.assign(object, {
            toCompactString: () => container.targetToken.toString(),
            toPrettyString: toPrettyString,
            toString: toPrettyString,
            debug,
        });
    }
};

const Pattern = {
    createFrom(container, object) {
        return Object.assign(object, {
            getPattern: () => container.targetToken,
        });
    },
};

const FinishPattern = {
    createFrom(container, object) {
        return Factory.createFrom(Pattern.createFrom, FinishClause.createFrom)(container, object);
    },
};

function cloneElement(element, newValues = {}) {
    const base = Object.create(Object.getPrototypeOf(element));
    const clone = Object
        .assign(base, element, newValues);
    return Object.freeze(clone);
}

function cloneSolutionModifierContainer(container, token) {
    const targetToken = container.targetToken.token === "query" ?
        _cloneFromQuery(container.targetToken, token) :
        _cloneFromClause(container.targetToken, token);
    return cloneElement(container, { targetToken });
}
function _cloneFromClause(clauseToken, token) {
    const modifiers = clauseToken.modifiers.concat(token);
    return cloneElement(clauseToken, { modifiers });
}
function _cloneFromQuery(queryToken, token) {
    const queryClause = _cloneFromClause(queryToken.queryClause, token);
    return cloneElement(queryToken, { queryClause });
}

function getLimitFn(genericFactory, container) {
    return (limit) => {
        const token = new LimitToken(limit);
        const newContainer = cloneSolutionModifierContainer(container, token);
        return genericFactory(newContainer, {});
    };
}
const LimitClause = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            limit: getLimitFn(genericFactory, container),
        });
    },
};

function getOffsetFn(genericFactory, container) {
    return (offset) => {
        const token = new OffsetToken(offset);
        const newContainer = cloneSolutionModifierContainer(container, token);
        return genericFactory(newContainer, {});
    };
}
const OffsetClause = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            offset: getOffsetFn(genericFactory, container),
        });
    },
};

const NotTriplePattern = {
    createFrom: Pattern.createFrom,
};

function getAndFn(container) {
    return patterns => {
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        const newGroupToken = new GroupPatternToken();
        newGroupToken.patterns.push(...patterns.map(x => x.getPattern()));
        const groupPatterns = container.targetToken.groupPatterns.concat(newGroupToken);
        const unionToken = cloneElement(container.targetToken, { groupPatterns });
        const newContainer = new Container({
            iriResolver: container.iriResolver,
            targetToken: unionToken,
        });
        return UnionPattern.createFrom(newContainer, {});
    };
}
const UnionPattern = {
    createFrom(container, object) {
        return NotTriplePattern.createFrom(container, Object.assign(object, {
            and: getAndFn(container),
        }));
    },
};

function getUnionFn(container) {
    return patterns => {
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        const newGroupToken = new GroupPatternToken();
        newGroupToken.patterns.push(...patterns.map(x => x.getPattern()));
        const unionToken = new UnionPatternToken();
        unionToken.groupPatterns.push(container.targetToken, newGroupToken);
        const newContainer = new Container({
            iriResolver: container.iriResolver,
            targetToken: unionToken,
        });
        return UnionPattern.createFrom(newContainer, {});
    };
}
const GroupPattern = {
    createFrom(container, object) {
        return NotTriplePattern.createFrom(container, Object.assign(object, {
            union: getUnionFn(container),
        }));
    }
};

function getIRIToken(iri) {
    if (isPrefixed(iri))
        return new PrefixedNameToken(iri);
    return new IRIRefToken(iri);
}

const XSD$1 = {
    namespace: "http://www.w3.org/2001/XMLSchema#",
    boolean: "http://www.w3.org/2001/XMLSchema#boolean",
    byte: "http://www.w3.org/2001/XMLSchema#byte",
    date: "http://www.w3.org/2001/XMLSchema#date",
    dateTime: "http://www.w3.org/2001/XMLSchema#dateTime",
    decimal: "http://www.w3.org/2001/XMLSchema#decimal",
    double: "http://www.w3.org/2001/XMLSchema#double",
    duration: "http://www.w3.org/2001/XMLSchema#duration",
    float: "http://www.w3.org/2001/XMLSchema#float",
    gDay: "http://www.w3.org/2001/XMLSchema#gDay",
    gMonth: "http://www.w3.org/2001/XMLSchema#gMonth",
    gMonthDay: "http://www.w3.org/2001/XMLSchema#gMonthDay",
    gYear: "http://www.w3.org/2001/XMLSchema#gYear",
    gYearMonth: "http://www.w3.org/2001/XMLSchema#gYearMonth",
    int: "http://www.w3.org/2001/XMLSchema#int",
    integer: "http://www.w3.org/2001/XMLSchema#integer",
    long: "http://www.w3.org/2001/XMLSchema#long",
    negativeInteger: "http://www.w3.org/2001/XMLSchema#negativeInteger",
    nonNegativeInteger: "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
    nonPositiveInteger: "http://www.w3.org/2001/XMLSchema#nonPositiveInteger",
    object: "http://www.w3.org/2001/XMLSchema#object",
    positiveInteger: "http://www.w3.org/2001/XMLSchema#positiveInteger",
    short: "http://www.w3.org/2001/XMLSchema#short",
    string: "http://www.w3.org/2001/XMLSchema#string",
    time: "http://www.w3.org/2001/XMLSchema#time",
    unsignedByte: "http://www.w3.org/2001/XMLSchema#unsignedByte",
    unsignedInt: "http://www.w3.org/2001/XMLSchema#unsignedInt",
    unsignedLong: "http://www.w3.org/2001/XMLSchema#unsignedLong",
    unsignedShort: "http://www.w3.org/2001/XMLSchema#unsignedShort",
};

function convertValue(value) {
    if (value instanceof Date)
        return new RDFLiteralToken(value.toISOString(), getIRIToken(XSD$1.dateTime));
    if (typeof value === "object")
        return value.getSubject();
    if (typeof value === "string") {
        if (value === "UNDEF")
            return value;
        return new LiteralToken(value);
    }
    return new LiteralToken(value);
}

function getHasFn(container) {
    return (...values) => {
        const parsedValues = container.targetToken.values.slice();
        parsedValues.push(values.map(convertValue));
        const targetToken = cloneElement(container.targetToken, { values: parsedValues });
        const newContainer = cloneElement(container, { targetToken });
        return MultipleValuesPatternMore.createFrom(newContainer, {});
    };
}
const MultipleValuesPattern = {
    createFrom(container, object) {
        return NotTriplePattern.createFrom(container, Object.assign(object, {
            has: getHasFn(container),
        }));
    },
};
const MultipleValuesPatternMore = {
    createFrom(container, object) {
        return NotTriplePattern.createFrom(container, Object.assign(object, {
            and: getHasFn(container),
        }));
    },
};

function getHasFn$1(container) {
    return value => {
        const values = container.targetToken.values.slice();
        if (!values.length)
            values.push([]);
        values[0] = values[0].concat(convertValue(value));
        const targetToken = cloneElement(container.targetToken, { values });
        const newContainer = cloneElement(container, { targetToken });
        return SingleValuesPatternMore.createFrom(newContainer, {});
    };
}
const SingleValuesPattern = {
    createFrom(container, object) {
        return NotTriplePattern.createFrom(container, Object.assign(object, {
            has: getHasFn$1(container),
        }));
    },
};
const SingleValuesPatternMore = {
    createFrom(container, object) {
        return NotTriplePattern.createFrom(container, Object.assign(object, {
            and: getHasFn$1(container),
        }));
    },
};

function _getPatternContainer(container, targetToken) {
    return new Container({
        iriResolver: container.iriResolver,
        targetToken,
    });
}
function _getPattern(container, token) {
    const patternContainer = _getPatternContainer(container, token);
    return NotTriplePattern.createFrom(patternContainer, {});
}
function getGraphFn(container) {
    return (iriOrVariable, patterns) => {
        const varOrIRI = typeof iriOrVariable === "string" ?
            container.iriResolver.resolve(iriOrVariable) :
            iriOrVariable.getSubject();
        const token = new GraphToken(varOrIRI);
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        token.addPattern(...patterns.map(x => x.getPattern()));
        return _getPattern(container, token);
    };
}
function getGroupFn(container) {
    return (patterns) => {
        const token = new GroupPatternToken();
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        token.patterns.push(...patterns.map(x => x.getPattern()));
        const patternContainer = _getPatternContainer(container, token);
        return GroupPattern.createFrom(patternContainer, {});
    };
}
function getUnionFn$1(container) {
    return (patterns) => {
        const token = new UnionPatternToken();
        const patternContainer = _getPatternContainer(container, token);
        const unionPattern = UnionPattern
            .createFrom(patternContainer, {});
        return unionPattern.and(patterns);
    };
}
function getOptionalFn(container) {
    return (patterns) => {
        const token = new OptionalToken();
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        token.addPattern(...patterns.map(x => x.getPattern()));
        return _getPattern(container, token);
    };
}
function getMinusFn(container) {
    return (patterns) => {
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        const token = new MinusPatternToken();
        token.groupPattern.patterns
            .push(...patterns.map(x => x.getPattern()));
        return _getPattern(container, token);
    };
}
function getServiceFn(container, modifier) {
    return (resource, patterns) => {
        const varOrIRI = typeof resource === "string" ?
            container.iriResolver.resolve(resource) :
            resource.getSubject();
        const token = new ServicePatternToken(varOrIRI, modifier);
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        token.groupPattern.patterns
            .push(...patterns.map(x => x.getPattern()));
        return _getPattern(container, token);
    };
}
function getFilterFn(container) {
    return (rawConstraint) => {
        const token = new FilterToken(rawConstraint);
        return _getPattern(container, token);
    };
}
function getBindFn(container) {
    return (rawExpression, variable) => {
        const parsedVar = typeof variable === "string" ?
            new VariableToken(variable) :
            variable.getSubject();
        const token = new BindToken(rawExpression, parsedVar);
        return _getPattern(container, token);
    };
}
function getValuesFn(container) {
    return (...variables) => {
        const token = new ValuesToken();
        token.variables.push(...variables.map(x => x.getSubject()));
        const patternContainer = _getPatternContainer(container, token);
        if (variables.length === 1)
            return SingleValuesPattern
                .createFrom(patternContainer, {});
        return MultipleValuesPattern
            .createFrom(patternContainer, {});
    };
}
const NotTriplePatternsBuilder = {
    createFrom(container, object) {
        return Object.assign(object, {
            undefined: "UNDEF",
            graph: getGraphFn(container),
            group: getGroupFn(container),
            union: getUnionFn$1(container),
            optional: getOptionalFn(container),
            minus: getMinusFn(container),
            service: getServiceFn(container),
            serviceSilent: getServiceFn(container, "SILENT"),
            filter: getFilterFn(container),
            bind: getBindFn(container),
            values: getValuesFn(container),
        });
    },
};

class FluentPathContainer extends Container {
    constructor(data) {
        super(data);
        this.fluentPathFactory = data.fluentPathFactory;
        this.deniableFluentPathFactory = data.deniableFluentPathFactory;
        if (new.target === FluentPathContainer)
            Object.freeze(this);
    }
}

function getPropertyToken(container, property) {
    if (property === "a")
        return property;
    if (typeof property === "string")
        return container.iriResolver.resolve(property, true);
    if ("token" in property)
        return property;
    if ("getSubject" in property)
        return property.getSubject();
    return property.getPath();
}

class SharedSubPathToken {
    constructor(path) {
        this.token = "subPath";
        this.path = path;
    }
    toString() {
        if (!this.path)
            return "()";
        return `(${this.path})`;
    }
}

function _getTokenWrapper(...symbols) {
    return (token) => {
        if (token === "a")
            return token;
        if (symbols.indexOf(token.token) !== -1)
            return new SharedSubPathToken(token);
        return token;
    };
}
function _isBasePrimitive(token) {
    return token === "a"
        || token.token === "iri"
        || token.token === "prefixedName";
}
function _isPathInNegatedToken(token) {
    return _isBasePrimitive(token)
        || (token.token === "pathInverse"
            && _isBasePrimitive(token.path));
}

const _getInAlternativeToken = _getTokenWrapper("pathAlternative");
function getAlternativeFn(container) {
    return (...paths) => {
        const tokensParams = paths
            .reduce((array, paths) => array.concat(paths), [])
            .map(path => getPropertyToken(container, path));
        if (container.targetToken && !(container.targetToken instanceof PathAlternativeToken))
            tokensParams.unshift(container.targetToken);
        const processedTokens = tokensParams
            .map(_getInAlternativeToken);
        if (container.targetToken instanceof PathAlternativeToken)
            processedTokens.unshift(...container.targetToken.paths);
        const targetToken = new PathAlternativeToken();
        targetToken.paths.push(...processedTokens);
        const newContainer = new FluentPathContainer(Object.assign({}, container, { targetToken }));
        if (processedTokens.every(_isPathInNegatedToken))
            return container.deniableFluentPathFactory(newContainer, {});
        return container.fluentPathFactory(newContainer, {});
    };
}

//# sourceMappingURL=alternativeFn.js.map

const _getInInverseToken = _getTokenWrapper("pathAlternative", "pathSequence", "pathInverse");
function getInverseFn(container) {
    return (path) => {
        const token = container.targetToken
            ? container.targetToken
            : getPropertyToken(container, path);
        const inInverseToken = _getInInverseToken(token);
        const targetToken = new PathInverseToken(inInverseToken);
        const newContainer = new FluentPathContainer(Object.assign({}, container, { targetToken }));
        if (_isBasePrimitive(token))
            return container.deniableFluentPathFactory(newContainer, {});
        return container.fluentPathFactory(newContainer, {});
    };
}

const _getInModToken = _getTokenWrapper("pathAlternative", "pathSequence", "pathInverse", "pathMod");
function getModFn(container, mod) {
    return (path) => {
        const token = container.targetToken
            ? container.targetToken
            : getPropertyToken(container, path);
        const inModToken = _getInModToken(token);
        const targetToken = new PathModToken(inModToken, mod);
        const newContainer = new FluentPathContainer(Object.assign({}, container, { targetToken }));
        return container.fluentPathFactory(newContainer, {});
    };
}

const _getInSequenceToken = _getTokenWrapper("pathAlternative", "pathSequence");
function getSequenceFn(container) {
    return (...paths) => {
        const tokensParams = paths
            .reduce((array, paths) => array.concat(paths), [])
            .map(path => getPropertyToken(container, path));
        if (container.targetToken && !(container.targetToken instanceof PathSequenceToken))
            tokensParams.unshift(container.targetToken);
        const processedTokens = tokensParams
            .map(_getInSequenceToken);
        if (container.targetToken instanceof PathSequenceToken)
            processedTokens.unshift(...container.targetToken.paths);
        const targetToken = new PathSequenceToken();
        targetToken.paths.push(...processedTokens);
        const newContainer = new FluentPathContainer(Object.assign({}, container, { targetToken }));
        return container.fluentPathFactory(newContainer, {});
    };
}

//# sourceMappingURL=sequenceFn.js.map

function _canBeNegated(token) {
    return !token
        || _isPathInNegatedToken(token)
        || (token.token === "pathAlternative" && token.paths.every(_isPathInNegatedToken));
}
function getSubPathFn(container) {
    return (path) => {
        const token = container.targetToken
            ? container.targetToken
            : path === void 0 ? path
                : getPropertyToken(container, path);
        const targetToken = new SharedSubPathToken(token);
        const newContainer = new FluentPathContainer(Object.assign({}, container, { targetToken }));
        if (_canBeNegated(token))
            return container.deniableFluentPathFactory(newContainer, {});
        return container.fluentPathFactory(newContainer, {});
    };
}

const Path = {
    createFrom(container, object) {
        return Object.assign(object, {
            getPath: () => container.targetToken,
        });
    }
};

const FluentPath = {
    createFrom(container, object) {
        return Path.createFrom(container, Object.assign(object, {
            subPath: getSubPathFn(container),
            or: getAlternativeFn(container),
            then: getSequenceFn(container),
            inverse: getInverseFn(container),
            oneOrNone: getModFn(container, "?"),
            zeroOrMore: getModFn(container, "*"),
            onceOrMore: getModFn(container, "+"),
        }));
    },
};

const _getInNegatedToken = _getTokenWrapper("pathAlternative");
function getNegatedFn(container) {
    return (path) => {
        const token = container.targetToken
            ? container.targetToken
            : getPropertyToken(container, path);
        const inNegatedToken = _getInNegatedToken(token);
        const targetToken = new PathNegatedToken(inNegatedToken);
        const newContainer = new FluentPathContainer(Object.assign({}, container, { targetToken }));
        return container.fluentPathFactory(newContainer, {});
    };
}

const DeniableFluentPath = {
    createFrom(container, object) {
        return FluentPath.createFrom(container, Object.assign(object, {
            negated: getNegatedFn(container),
        }));
    },
};

const PathBuilder = {
    createFrom(container, object) {
        return Object.assign(object, {
            subPath: getSubPathFn(container),
            alternatives: getAlternativeFn(container),
            sequences: getSequenceFn(container),
            inverse: getInverseFn(container),
            negated: getNegatedFn(container),
            oneOrNone: getModFn(container, "?"),
            zeroOrMore: getModFn(container, "*"),
            onceOrMore: getModFn(container, "+"),
        });
    }
};

function _getContainer(container, targetToken) {
    return new FluentPathContainer(Object.assign({}, container, { targetToken: targetToken, fluentPathFactory: FluentPath.createFrom, deniableFluentPathFactory: DeniableFluentPath.createFrom }));
}
function _parseProperty(container, property) {
    const targetToken = getPropertyToken(container, property);
    const newContainer = _getContainer(container, targetToken);
    return DeniableFluentPath.createFrom(newContainer, {});
}
function getPathFn(container) {
    return (propertyOrBuilderFn) => {
        if (typeof propertyOrBuilderFn !== "function")
            return _parseProperty(container, propertyOrBuilderFn);
        const newContainer = _getContainer(container);
        const pathBuilder = PathBuilder.createFrom(newContainer, {});
        return propertyOrBuilderFn(pathBuilder);
    };
}
const PathsBuilder = {
    createFrom(container, object) {
        return Object.assign(object, {
            path: getPathFn(container),
        });
    }
};

function _cloneContainer(container, propertyToken) {
    const properties = container.targetToken.properties.concat(propertyToken);
    const targetToken = cloneElement(container.targetToken, { properties });
    return cloneElement(container, { targetToken });
}
function _updateContainer(container, propertyToken) {
    container.targetToken.properties.push(propertyToken);
    return container;
}
function getHasFn$2(genericFactory, container) {
    return (property, objects) => {
        const verbToken = getPropertyToken(container, property);
        const propertyToken = new PropertyToken(verbToken);
        objects = Array.isArray(objects) ? objects : [objects];
        propertyToken.addObject(...objects.map(convertValue));
        const newContainer = container.targetToken.token === "subject" ?
            _cloneContainer(container, propertyToken) :
            _updateContainer(container, propertyToken);
        const genericObject = genericFactory(newContainer, {});
        return PropertyBuilderMore.createFrom(genericFactory, newContainer, genericObject);
    };
}
const PropertyBuilder = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            has: getHasFn$2(genericFactory, container),
        });
    }
};
const PropertyBuilderMore = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            and: getHasFn$2(genericFactory, container),
        });
    }
};

const emptyGenericFactory = (container, object) => object;
const BlankNodeBuilder = {
    createFrom(container, object) {
        return PropertyBuilder.createFrom(emptyGenericFactory, container, object);
    }
};

const TriplePattern = {
    createFrom: Pattern.createFrom,
};

const TripleSubject = {
    createFrom(container, object) {
        const triplePatternFactory = TriplePattern.createFrom;
        return PropertyBuilder.createFrom(triplePatternFactory, container, Object.assign(object, {
            getSubject: () => container.targetToken.subject,
        }));
    }
};

function getWithTypeFn(container) {
    return type => {
        if (type in XSD$1)
            type = XSD$1[type];
        const iriType = container.iriResolver.resolve(type, true);
        const subject = cloneElement(container.targetToken.subject, { type: iriType });
        const targetToken = cloneElement(container.targetToken, { subject });
        const newContainer = cloneElement(container, { targetToken });
        return TripleSubject.createFrom(newContainer, {});
    };
}
function getWithLanguageFn(container) {
    return language => {
        const langToken = new LanguageToken(language);
        const subject = cloneElement(container.targetToken.subject, { language: langToken });
        const targetToken = cloneElement(container.targetToken, { subject });
        const newContainer = cloneElement(container, { targetToken });
        return TripleSubject.createFrom(newContainer, {});
    };
}
const RDFLiteral$1 = {
    createFrom(container, object) {
        return TripleSubject.createFrom(container, Object.assign(object, {
            withType: getWithTypeFn(container),
            withLanguage: getWithLanguageFn(container),
        }));
    },
};

function _getPatternContainer$1(container, token) {
    return new Container({
        iriResolver: container.iriResolver,
        targetToken: new SubjectToken(token),
    });
}
function _getTripleSubject(container, token) {
    const patternContainer = _getPatternContainer$1(container, token);
    return TripleSubject.createFrom(patternContainer, {});
}
function _getNodeSubject(container, token) {
    const patternContainer = _getPatternContainer$1(container, token);
    return Factory.createFrom(TripleSubject.createFrom, Pattern.createFrom)(patternContainer, {});
}
function getResourceFn(container) {
    return iri => {
        const token = container.iriResolver.resolve(iri);
        return _getTripleSubject(container, token);
    };
}
function getVarFn(container) {
    return name => {
        const token = new VariableToken(name);
        return _getTripleSubject(container, token);
    };
}
function getLiteralFn(container) {
    return (value) => {
        if (typeof value !== "string") {
            const token = new LiteralToken(value);
            return _getTripleSubject(container, token);
        }
        const token = new RDFLiteralToken(value);
        const patternContainer = _getPatternContainer$1(container, token);
        return RDFLiteral$1.createFrom(patternContainer, {});
    };
}
function getCollectionFn(container) {
    return (...values) => {
        const token = new CollectionToken()
            .addObject(...values.map(convertValue));
        return _getNodeSubject(container, token);
    };
}
function _getBlankNode(container, label) {
    if (label && !label.startsWith("_:"))
        label = "_:" + label;
    const token = new BlankNodeToken(label);
    return _getTripleSubject(container, token);
}
function _getBlankNodeProperty(container, builderFn) {
    const token = new BlankNodePropertyToken();
    const builderContainer = new Container({
        iriResolver: container.iriResolver,
        targetToken: token,
    });
    const builder = BlankNodeBuilder.createFrom(builderContainer, {});
    builderFn(builder);
    if (token.properties.length < 1)
        throw new Error("At least one property must be specified by the self builder.");
    return _getNodeSubject(container, token);
}
function getBlankNodeFn(container) {
    return (labelOrBuilderFn) => {
        if (typeof labelOrBuilderFn === "function")
            return _getBlankNodeProperty(container, labelOrBuilderFn);
        return _getBlankNode(container, labelOrBuilderFn);
    };
}
const TriplePatternsBuilder = {
    createFrom(container, object) {
        return Object.assign(object, {
            resource: getResourceFn(container),
            var: getVarFn(container),
            literal: getLiteralFn(container),
            collection: getCollectionFn(container),
            blankNode: getBlankNodeFn(container),
        });
    },
};

const PatternBuilder = {
    create(iriResolver) {
        const container = new Container({
            iriResolver,
            targetToken: void 0,
        });
        return PatternBuilder
            .createFrom(container, {});
    },
    createFrom(container, object) {
        return Factory.createFrom(TriplePatternsBuilder.createFrom, NotTriplePatternsBuilder.createFrom, SubSelectPattern.createFrom, PathsBuilder.createFrom)(container, object);
    },
};

function _normalizeVariables(variableOrVariables) {
    const variables = Array.isArray(variableOrVariables) ? variableOrVariables : [variableOrVariables];
    return variables.map(x => new VariableToken(x));
}
function _normalizeRawValues(valuesOrBuilder, iriResolver, isSingle) {
    let rawValues = typeof valuesOrBuilder === "function" ?
        valuesOrBuilder(PatternBuilder.create(iriResolver)) :
        valuesOrBuilder;
    if (!Array.isArray(rawValues))
        return [[rawValues]];
    if (isSingle)
        rawValues.map(value => [value]);
    if (rawValues.some(Array.isArray))
        return rawValues;
    return [rawValues];
}
function createValuesFn(genericFactory, container) {
    return (variableOrVariables, valuesOrBuilder) => {
        const token = new ValuesToken();
        const variables = _normalizeVariables(variableOrVariables);
        token.addVariables(...variables);
        const isSingle = !Array.isArray(variableOrVariables);
        const iriResolver = new IRIResolver(container.iriResolver);
        const values = _normalizeRawValues(valuesOrBuilder, iriResolver, isSingle);
        values.forEach((valuesRow) => token.addValues(...valuesRow.map(convertValue)));
        const targetToken = cloneElement(container.targetToken, { values: token });
        const newContainer = cloneElement(container, { iriResolver, targetToken });
        return genericFactory(newContainer, {});
    };
}
const ValuesClause = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            values: createValuesFn(genericFactory, container),
        });
    },
};

function _getLimitFactory(valuesFactory) {
    const offsetValuesFactory = OffsetClause
        .createFrom.bind(null, valuesFactory);
    return (container1, object1) => LimitClause
        .createFrom(Factory.createFrom(offsetValuesFactory, valuesFactory), container1, object1);
}
function _getOffsetFactory(valuesFactory) {
    const limitValuesFactory = LimitClause
        .createFrom.bind(null, valuesFactory);
    return (container1, object1) => OffsetClause
        .createFrom(Factory.createFrom(valuesFactory, limitValuesFactory), container1, object1);
}
const LimitOffsetClause = {
    createFrom(genericFactory, container, object) {
        const valuesFactory = ValuesClause
            .createFrom.bind(null, genericFactory);
        const genericAndValuesFactory = Factory.createFrom(genericFactory, valuesFactory);
        return Factory.createFrom(_getLimitFactory(genericAndValuesFactory), _getOffsetFactory(genericAndValuesFactory), valuesFactory)(container, object);
    },
};

function getOrderByFn(genericFactory, container) {
    return (rawCondition) => {
        const token = new OrderToken(rawCondition);
        const newContainer = cloneSolutionModifierContainer(container, token);
        const limitOffsetClause = LimitOffsetClause.createFrom(genericFactory, newContainer, {});
        return genericFactory(newContainer, limitOffsetClause);
    };
}
const OrderClause = {
    createFrom(genericFactory, container, object) {
        return LimitOffsetClause.createFrom(genericFactory, container, Object.assign(object, {
            orderBy: getOrderByFn(genericFactory, container),
        }));
    }
};

function getHavingFn(genericFactory, container) {
    return (rawCondition) => {
        const token = new HavingToken(rawCondition);
        const newContainer = cloneSolutionModifierContainer(container, token);
        const orderClause = OrderClause.createFrom(genericFactory, newContainer, {});
        return genericFactory(newContainer, orderClause);
    };
}
const HavingClause = {
    createFrom(genericFactory, container, object) {
        return OrderClause.createFrom(genericFactory, container, Object.assign(object, {
            having: getHavingFn(genericFactory, container),
        }));
    },
};

function getGroupByFn(genericFactory, container) {
    return (rawCondition) => {
        const token = new GroupToken(rawCondition);
        const newContainer = cloneSolutionModifierContainer(container, token);
        const havingClause = HavingClause.createFrom(genericFactory, newContainer, {});
        return genericFactory(newContainer, havingClause);
    };
}
const GroupClause = {
    createFrom(genericFactory, container, object) {
        return HavingClause.createFrom(genericFactory, container, Object.assign(object, {
            groupBy: getGroupByFn(genericFactory, container),
        }));
    },
};

function getWhereFn(container) {
    return (patterns) => {
        const where = new WhereToken();
        patterns = Array.isArray(patterns) ? patterns : [patterns];
        where.groupPattern.patterns.push(...patterns.map(x => x.getPattern()));
        const targetToken = cloneElement(container.targetToken, { where });
        const newContainer = cloneElement(container, { targetToken });
        const groupClause = GroupClause.createFrom(FinishPattern.createFrom, newContainer, {});
        return FinishPattern.createFrom(newContainer, groupClause);
    };
}
const WherePattern = {
    createFrom(container, object) {
        return Object.assign(object, {
            where: getWhereFn(container),
        });
    },
};

function getSelectFn(container, modifier) {
    return (...variables) => {
        const targetToken = new SubSelectToken(modifier);
        if (variables.length)
            targetToken.addVariable(...variables.map(x => new VariableToken(x)));
        const newContainer = new Container({
            iriResolver: container.iriResolver,
            targetToken
        });
        return WherePattern.createFrom(newContainer, {});
    };
}
const SubSelectPattern = {
    createFrom(container, object) {
        return Object.assign(object, {
            select: getSelectFn(container),
            selectDistinct: getSelectFn(container, "DISTINCT"),
            selectReduced: getSelectFn(container, "REDUCED"),
            selectAll: () => getSelectFn(container)(),
            selectAllDistinct: () => getSelectFn(container, "DISTINCT")(),
            selectAllReduced: () => getSelectFn(container, "REDUCED")(),
        });
    },
};

var QueryContainerPropertyType;
(function (QueryContainerPropertyType) {
    QueryContainerPropertyType["CHILD"] = "child";
    QueryContainerPropertyType["MEMBER"] = "member";
})(QueryContainerPropertyType || (QueryContainerPropertyType = {}));

class IllegalActionError extends AbstractError {
    get name() { return "IllegalActionError"; }
}

var QueryPropertyType;
(function (QueryPropertyType) {
    QueryPropertyType[QueryPropertyType["PARTIAL"] = 0] = "PARTIAL";
    QueryPropertyType[QueryPropertyType["EMPTY"] = 1] = "EMPTY";
    QueryPropertyType[QueryPropertyType["ALL"] = 2] = "ALL";
    QueryPropertyType[QueryPropertyType["FULL"] = 3] = "FULL";
})(QueryPropertyType || (QueryPropertyType = {}));

function _getRootPath(path) {
    const [root] = path
        .split(".")
        .slice(0, 1);
    return root;
}
function _getPathProperty(element, path) {
    if (element === void 0 || !path)
        return element;
    const [propName, ...restParts] = path.split(".");
    const property = element[propName];
    const restPath = restParts.join(".");
    return _getPathProperty(property, restPath);
}
function _areDifferentType(a, b) {
    if (typeof a !== typeof b)
        return true;
    if (typeof a === "object")
        return a instanceof Date !== b instanceof Date;
    return false;
}
function _getBestType(type1, type2) {
    if (type2 <= type1)
        return type1;
    return type2;
}
function _getMatchingDefinition(generalSchema, targetSchema, propertyName, propertyURI) {
    if (!targetSchema.properties.has(propertyName))
        return;
    const definition = ObjectSchemaUtils
        ._resolveProperty(generalSchema, targetSchema.properties.get(propertyName));
    if (propertyURI === void 0 || propertyURI === definition.uri)
        return definition;
}

class QueryProperty {
    get variable() {
        return this.queryContainer
            .getVariable(this.fullName);
    }
    get identifier() {
        if (this.values.length === 1) {
            return this.values[0];
        }
        return this.queryContainer
            .getVariable(this.fullName);
    }
    constructor(data) {
        this.queryContainer = data.queryContainer;
        this.parent = data.parent;
        this.name = data.name;
        this.fullName = data.parent
            ? data.parent.fullName + "." + data.name
            : data.name;
        this.definition = data.definition;
        this.pathBuilderFn = data.pathBuilderFn;
        this.propertyType = data.propertyType;
        this.optional = data.optional === void 0
            ? true
            : data.optional;
        this.subProperties = new Map();
        this.values = data.values ? data.values : [];
        this._types = [];
        this._filters = [];
    }
    hasProperties() {
        return this.subProperties.size !== 0
            || this._isComplete();
    }
    getProperty(path, flags) {
        if (!path)
            return this;
        const rootPath = _getRootPath(path);
        const property = this.subProperties.get(rootPath);
        if (!property) {
            if (rootPath === path && flags && flags.create && this._isComplete()) {
                const newProperty = this.addProperty(rootPath, flags);
                if (this.propertyType === QueryPropertyType.FULL)
                    newProperty.setType(QueryPropertyType.ALL);
                return newProperty;
            }
            return;
        }
        const restPath = path.substr(rootPath.length + 1);
        return property.getProperty(restPath);
    }
    addProperty(propertyName, propertyDefinition) {
        const definition = this
            .__getDefinition(propertyName, propertyDefinition);
        return this._addSubProperty(propertyName, {
            definition,
            pathBuilderFn: propertyDefinition.path,
            optional: !propertyDefinition.required,
        });
    }
    _addSubProperty(propertyName, data) {
        const property = new QueryProperty(Object.assign({}, data, { name: propertyName, queryContainer: this.queryContainer, parent: this }));
        this.subProperties.set(propertyName, property);
        return property;
    }
    __getDefinition(propertyName, propertyDefinition) {
        const digestedDefinition = this.queryContainer
            .digestProperty(propertyName, propertyDefinition);
        if (propertyDefinition.inherit === false)
            return digestedDefinition;
        const propertyURI = "@id" in propertyDefinition ? digestedDefinition.uri : void 0;
        const inheritDefinition = this
            .__getInheritDefinition(propertyName, propertyURI);
        if (inheritDefinition) {
            for (const key in inheritDefinition) {
                if (digestedDefinition[key] !== null && key !== "uri")
                    continue;
                digestedDefinition[key] = inheritDefinition[key];
            }
        }
        return digestedDefinition;
    }
    __getInheritDefinition(propertyName, propertyURI) {
        const searchSchema = this._getSearchSchema();
        const localDefinition = _getMatchingDefinition(searchSchema, searchSchema, propertyName, propertyURI);
        if (localDefinition)
            return localDefinition;
        const schemas = this.queryContainer.context
            ._getTypeObjectSchemas(this._types);
        for (const targetSchema of schemas) {
            const definition = _getMatchingDefinition(searchSchema, targetSchema, propertyName, propertyURI);
            if (definition)
                return definition;
        }
    }
    _isComplete() {
        return this.propertyType === QueryPropertyType.ALL
            || this.propertyType === QueryPropertyType.FULL;
    }
    _isPartial() {
        return this.propertyType === QueryPropertyType.PARTIAL
            || this.propertyType === QueryPropertyType.ALL
            || !!this.subProperties.size;
    }
    _isEmpty() {
        return this.propertyType === undefined
            || this.propertyType === QueryPropertyType.EMPTY;
    }
    setType(type) {
        this.propertyType = _getBestType(this.propertyType, type);
    }
    addType(type) {
        const schema = this._getSearchSchema();
        const iri = schema.resolveURI(type, { vocab: true });
        this._types.push(iri);
        if (!this.queryContainer.context.hasObjectSchema(iri))
            return;
        const typedSchema = this.queryContainer.context.getObjectSchema(iri);
        ObjectSchemaDigester._combineSchemas([schema, typedSchema]);
    }
    addValues(values) {
        this.values.push(...values);
    }
    addFilter(constraint) {
        this._filters.push(constraint);
    }
    setObligatory(flags) {
        if (!this.optional)
            return;
        this.optional = false;
        if (flags && flags.inheritParents && this.parent)
            this.parent.setObligatory(flags);
    }
    _getVariable(name) {
        return this.queryContainer
            .getVariable(`${this.fullName}.${name}`);
    }
    __createIRIToken() {
        return this
            .queryContainer
            .compactIRI(this.definition.uri);
    }
    __createPathToken() {
        if (!this.pathBuilderFn)
            return this.__createIRIToken();
        const pathBuilder = PathBuilder
            .createFrom(this.queryContainer, {});
        return this.pathBuilderFn
            .call(void 0, pathBuilder)
            .getPath();
    }
    _getContextVariable() {
        if (this.propertyType === QueryPropertyType.FULL)
            return this.__getSelfToken();
        return this._getVariable("_graph");
    }
    _getContextGraph() {
        return new GraphToken(this._getContextVariable());
    }
    getSelfPattern() {
        const pattern = this.__createSelfPattern();
        if (!pattern)
            return;
        if (!this.optional)
            return pattern;
        return new OptionalToken()
            .addPattern(pattern);
    }
    __createSelfPattern() {
        if (!this.parent)
            throw new IllegalActionError("Cannot create pattern without a parent.");
        return this
            .__addPropertyTo(new SubjectToken(this.parent.identifier));
    }
    __addPropertyTo(subject) {
        return subject
            .addProperty(new PropertyToken(this.__createPathToken())
            .addObject(this.identifier));
    }
    getSearchPatterns() {
        const patterns = this
            .__createSearchPatterns();
        if (!this.optional)
            return patterns;
        return [new OptionalToken()
                .addPattern(...patterns),
        ];
    }
    __createSearchPatterns() {
        const patterns = [];
        const values = this.__createValuesPattern();
        if (values)
            patterns.push(values);
        const selfTriple = this.__createSelfPattern();
        if (selfTriple) {
            if (this.parent && !this.pathBuilderFn) {
                patterns.push(this.parent._getContextGraph()
                    .addPattern(selfTriple));
            }
            else {
                patterns.push(selfTriple);
            }
        }
        switch (this.propertyType) {
            case QueryPropertyType.EMPTY:
                patterns.push(this.__createTypesSearchPatterns());
                break;
            case QueryPropertyType.PARTIAL:
                patterns.push(...this.__createPartialSearchPatterns());
                break;
            case QueryPropertyType.ALL:
                patterns.push(this.__createSearchAllPattern());
                patterns.push(...this.__createSubPropertiesPatterns());
                break;
            case QueryPropertyType.FULL:
                patterns.push(this.__createSearchGraphPattern());
                patterns.push(...this.__createSubPropertiesPatterns());
                break;
            default:
                const selfTypeFilter = this.__createSelfTypeFilter();
                if (selfTypeFilter)
                    patterns.push(selfTypeFilter);
                break;
        }
        if (this._filters.length) {
            const filters = this._filters
                .map(constraint => new FilterToken(constraint));
            patterns.push(...filters);
        }
        return patterns;
    }
    __createValuesPattern() {
        if (this.values.length <= 1)
            return;
        const values = new ValuesToken()
            .addVariables(this.variable);
        this.values
            .forEach(value => values.addValues(value));
        return values;
    }
    __createSelfTypeFilter() {
        const identifier = this.identifier;
        if (this.definition.literal) {
            const literalToken = this.queryContainer
                .compactIRI(this.definition.literalType);
            if (identifier.token === "variable")
                return new FilterToken(`datatype( ${identifier} ) = ${literalToken}`);
        }
        if (this.definition.pointerType !== null && identifier.token === "variable")
            return new FilterToken(`! isLiteral( ${identifier} )`);
    }
    __createPartialSearchPatterns() {
        return [
            this.__createTypesSearchPatterns(),
            ...this.__createSubPropertiesPatterns(),
        ];
    }
    __createSubPropertiesPatterns() {
        const patterns = [];
        this.subProperties.forEach(subProperty => {
            patterns.push(...subProperty.getSearchPatterns());
        });
        return patterns;
    }
    __createTypesSearchPatterns() {
        const types = this.__createTypesPattern();
        const pattern = this.propertyType === QueryPropertyType.EMPTY
            ? types
            : this._getContextGraph()
                .addPattern(types);
        if (!this._types.length)
            return new OptionalToken()
                .addPattern(pattern);
        this.__addTypesTo(types);
        return pattern;
    }
    __addTypesTo(pattern) {
        const types = this
            .__createTypesTokens();
        let aProperty = pattern.properties
            .find(_ => _.verb === "a");
        if (!aProperty) {
            aProperty = new PropertyToken("a");
            pattern.addProperty(aProperty);
        }
        aProperty.objects
            .unshift(...types);
    }
    __createTypesTokens() {
        return this._types
            .map(type => this.queryContainer.compactIRI(type));
    }
    __createSearchAllPattern() {
        const pattern = this.__createAllPattern();
        if (this._types.length)
            this.__addTypesTo(pattern);
        return this
            ._getContextGraph()
            .addPattern(pattern);
    }
    __createSearchGraphPattern() {
        const graph = new GraphToken(this.__getSelfToken());
        if (this._types.length) {
            const pattern = new SubjectToken(this.__getSelfToken());
            this.__addTypesTo(pattern);
            graph.addPattern(pattern);
        }
        return graph
            .addPattern(this.__createGraphSubPattern());
    }
    __getValuedPatterns() {
        if (this.optional)
            return;
        const selfSubject = new SubjectToken(this.identifier);
        const patterns = [selfSubject];
        const valuesPattern = this.__createValuesPattern();
        if (valuesPattern)
            patterns.push(valuesPattern);
        if (this._types.length) {
            const typesTokens = this
                .__createTypesTokens();
            selfSubject
                .addProperty(new PropertyToken("a")
                .addObject(...typesTokens));
        }
        this.subProperties.forEach(subProperty => {
            const subPatterns = subProperty
                .__getValuedPatterns();
            if (subPatterns) {
                subProperty.__addPropertyTo(selfSubject);
                patterns.push(...subPatterns);
            }
        });
        if (!selfSubject.properties.length)
            return patterns.slice(1);
        return patterns;
    }
    getConstructPatterns() {
        const patterns = [];
        const selfPattern = this.__createSelfConstructPattern();
        if (selfPattern)
            patterns.push(selfPattern);
        this.subProperties.forEach(property => {
            const subPatterns = property
                .getConstructPatterns();
            patterns.push(...subPatterns);
        });
        return patterns;
    }
    __createSelfConstructPattern() {
        switch (this.propertyType) {
            case QueryPropertyType.EMPTY:
                return this.__createTypesPattern();
            case QueryPropertyType.PARTIAL:
                return this.__createPartialConstructPattern();
            case QueryPropertyType.ALL:
            case QueryPropertyType.FULL:
                return this.__createCompleteConstructPattern()
                    .addProperty(new PropertyToken(this.queryContainer.compactIRI(C.document))
                    .addObject(this._getContextVariable()));
            default:
                return;
        }
    }
    __createCompleteConstructPattern() {
        switch (this.propertyType) {
            case QueryPropertyType.ALL:
                return this.__createAllPattern();
            case QueryPropertyType.FULL:
                return this.__createGraphSubPattern();
            default:
                throw new IllegalActionError("Invalid property type");
        }
    }
    __createPartialConstructPattern() {
        const subject = this.__createTypesPattern()
            .addProperty(new PropertyToken(this.queryContainer.compactIRI(C.document))
            .addObject(this._getContextVariable()));
        this.subProperties.forEach(subProperty => {
            subject.addProperty(new PropertyToken(subProperty.__createIRIToken())
                .addObject(subProperty.identifier));
        });
        return subject;
    }
    __createTypesPattern() {
        return new SubjectToken(this.identifier)
            .addProperty(new PropertyToken("a")
            .addObject(this._getVariable("types")));
    }
    __createAllPattern() {
        return new SubjectToken(this.__getSelfToken())
            .addProperty(new PropertyToken(this._getVariable("_predicate"))
            .addObject(this._getVariable("_object")));
    }
    __createGraphSubPattern() {
        return new SubjectToken(this._getVariable("_subject"))
            .addProperty(new PropertyToken(this._getVariable("_predicate"))
            .addObject(this._getVariable("_object")));
    }
    __getSelfToken() {
        const identifier = this.identifier;
        if (identifier.token === "literal")
            throw new IllegalActionError(`Property is not a resource.`);
        return identifier;
    }
    getSchemaFor(object) {
        switch (this.propertyType) {
            case void 0:
                return new DigestedObjectSchema();
            case QueryPropertyType.EMPTY:
            case QueryPropertyType.PARTIAL:
                return this.__createSchema();
            default:
                return ObjectSchemaDigester._combineSchemas([
                    this.queryContainer.context.registry.getSchemaFor(object),
                    this.__createSchema(),
                ]);
        }
    }
    __createSchema() {
        const schema = new DigestedObjectSchema();
        this.subProperties.forEach(property => {
            schema.properties.set(property.name, property.definition);
        });
        return schema;
    }
    _getSearchSchema() {
        if (this._searchSchema)
            return this._searchSchema;
        return this._searchSchema = this.queryContainer.getGeneralSchema();
    }
}

class QueryContainerProperty extends QueryProperty {
    constructor(data) {
        super({
            queryContainer: data.queryContainer,
            name: data.containerPropertyType,
            definition: new DigestedObjectSchemaProperty(),
            optional: false,
            propertyType: QueryPropertyType.PARTIAL,
        });
        this.containerIRI = data.containerIRI;
        this.containerPropertyType = data.containerPropertyType;
    }
    __createSelfPattern() {
        const subSelect = new SubSelectToken("DISTINCT")
            .addVariable(this.variable);
        switch (this.containerPropertyType) {
            case QueryContainerPropertyType.CHILD:
                subSelect.addPattern(this.__createChildSelfPattern());
                break;
            case QueryContainerPropertyType.MEMBER:
                subSelect.addPattern(...this.__createMemberSelfPattern());
                break;
            default:
                throw new IllegalStateError(`Invalid container type.`);
        }
        const valuedPatterns = this.__getValuedPatterns();
        if (valuedPatterns)
            subSelect.addPattern(...valuedPatterns);
        this.__addOrderTo(subSelect);
        this.__addLimitTo(subSelect);
        this.__addOffsetTo(subSelect);
        return subSelect;
    }
    __createChildSelfPattern() {
        return new SubjectToken(this.containerIRI)
            .addProperty(new PropertyToken(this.queryContainer.compactIRI(LDP.contains))
            .addObject(this.identifier));
    }
    __createMemberSelfPattern() {
        const membershipResource = this.queryContainer.getVariable("membershipResource");
        const hasMemberRelation = this.queryContainer.getVariable("hasMemberRelation");
        const memberRelations = new SubSelectToken()
            .addVariable(membershipResource, hasMemberRelation)
            .addPattern(new SubjectToken(this.containerIRI)
            .addProperty(new PropertyToken(this.queryContainer.compactIRI(LDP.membershipResource))
            .addObject(membershipResource))
            .addProperty(new PropertyToken(this.queryContainer.compactIRI(LDP.hasMemberRelation))
            .addObject(hasMemberRelation)));
        const memberSelection = new SubjectToken(membershipResource)
            .addProperty(new PropertyToken(hasMemberRelation)
            .addObject(this.identifier));
        return [memberRelations, memberSelection];
    }
    __addLimitTo(subSelect) {
        if (this._limit === void 0)
            return;
        subSelect.addModifier(new LimitToken(this._limit));
    }
    __addOffsetTo(subSelect) {
        if (this._offset === void 0)
            return;
        subSelect.addModifier(new OffsetToken(this._offset));
    }
    __addOrderTo(subSelect) {
        if (!this.order)
            return;
        const targetProperty = this.getProperty(this.order.path, { create: true });
        if (!targetProperty)
            throw new IllegalArgumentError(`Property "${this.order.path}" hasn't been defined.`);
        const identifier = targetProperty.identifier;
        const constraint = identifier.token === "variable"
            ? identifier
            : `( ${identifier} )`;
        subSelect.addModifier(new OrderToken(constraint, this.order.flow));
        const orderPatterns = this.__createSubPatternsFrom(targetProperty);
        orderPatterns
            .filter(pattern => {
            if (pattern.token !== "subject")
                return true;
            const targetSubject = subSelect
                .where.groupPattern.patterns
                .find((selectPattern) => {
                if (selectPattern.token !== "subject")
                    return false;
                return selectPattern.subject === pattern.subject;
            });
            if (!targetSubject)
                return true;
            pattern.properties.forEach(property => {
                const targetPredicate = targetSubject
                    .properties
                    .find((selectProperty) => {
                    return property.toString() === selectProperty.toString();
                });
                if (!targetPredicate)
                    targetSubject.addProperty(property);
                property.objects.forEach(object => {
                    const targetObject = targetPredicate
                        .objects
                        .find((selectObject) => {
                        return selectObject.toString() === object.toString();
                    });
                    if (!targetObject)
                        targetPredicate.addObject(object);
                });
            });
        })
            .forEach(pattern => {
            subSelect.addPattern(pattern);
        });
    }
    __createSubPatternsFrom(targetProperty) {
        let matchPatterns = [];
        while (targetProperty !== this) {
            const subTargetPattern = targetProperty.getSelfPattern();
            if (subTargetPattern.token !== "optional") {
                matchPatterns.unshift(subTargetPattern);
            }
            else {
                matchPatterns = [
                    subTargetPattern
                        .addPattern(...matchPatterns),
                ];
            }
            if (!targetProperty.parent)
                break;
            targetProperty = targetProperty.parent;
        }
        return matchPatterns;
    }
    __addTypesTo(pattern) { }
    setOrder(order) {
        this.order = order;
    }
    setLimit(limit) {
        this._limit = limit;
    }
    setOffset(offset) {
        this._offset = offset;
    }
}

class QueryRootProperty extends QueryProperty {
    constructor(data) {
        super({
            queryContainer: data.queryContainer,
            name: "document",
            definition: new DigestedObjectSchemaProperty(),
            optional: false,
            propertyType: QueryPropertyType.PARTIAL,
            values: data.values,
        });
    }
    __createSelfPattern() {
        return;
    }
}

class QueryVariable extends VariableToken {
    constructor(name, index) {
        super(name
            .replace(/[.]/g, "__")
            .replace(/[^0-9A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/g, "_"));
        this.index = index;
    }
    toString() {
        if ("development" === "production")
            return `?_${this.index}`;
        else
            return super.toString();
    }
}

class QueryContainer extends FluentPathContainer {
    constructor(context, propertyData) {
        const schema = context.getObjectSchema();
        super({
            iriResolver: __createIRIResolver(schema),
            targetToken: void 0,
            fluentPathFactory: FluentPath.createFrom,
            deniableFluentPathFactory: DeniableFluentPath.createFrom,
        });
        this.context = context;
        this._generalSchema = schema;
        this._prefixesTuples = Array.from(schema.prefixes);
        this._variablesCounter = 0;
        this._variablesMap = new Map();
        if ("uris" in propertyData) {
            const values = propertyData.uris.map(this.compactIRI, this);
            this._queryProperty = new QueryRootProperty({
                queryContainer: this,
                values: values,
            });
        }
        else {
            const iri = this.compactIRI(propertyData.uri);
            this._queryProperty = new QueryContainerProperty({
                queryContainer: this,
                containerIRI: iri,
                containerPropertyType: propertyData.containerPropertyType,
            });
        }
    }
    getVariable(name) {
        if (this._variablesMap.has(name))
            return this._variablesMap.get(name);
        const variable = new QueryVariable(name, this._variablesCounter++);
        this._variablesMap.set(name, variable);
        return variable;
    }
    compactIRI(iri) {
        const compactedIRI = this.__getCompactedIRI(iri);
        return this.iriResolver.resolve(compactedIRI);
    }
    __getCompactedIRI(iri) {
        if (isPrefixed(iri))
            return iri;
        const prefix = this._prefixesTuples
            .find(([, x]) => iri.startsWith(x));
        if (!prefix)
            return iri;
        const [namespace, prefixIRI] = prefix;
        return `${namespace}:${iri.substr(prefixIRI.length)}`;
    }
    getPrologues() {
        return this._prefixesTuples
            .filter(this.__isUsedPrefix, this)
            .map(__createPrefixToken);
    }
    __isUsedPrefix([namespace,]) {
        return !!this.iriResolver.prefixes.get(namespace);
    }
    digestProperty(name, definition) {
        return ObjectSchemaDigester
            .digestProperty(name, definition, this._generalSchema);
    }
    getGeneralSchema() {
        return ObjectSchemaDigester
            .combineDigestedObjectSchemas([this._generalSchema]);
    }
    serializeLiteral(type, value) {
        if (!this.context.jsonldConverter.literalSerializers.has(type))
            throw new IllegalArgumentError(`Type "${type}" hasn't a defined serializer.`);
        return this.context.jsonldConverter
            .literalSerializers
            .get(type)
            .serialize(value);
    }
}
function __createIRIResolver(schema) {
    const iriResolver = new IRIResolver(void 0, schema.vocab);
    Array.from(schema.prefixes.keys())
        .forEach(key => iriResolver.prefixes.set(key, false));
    return iriResolver;
}
function __createPrefixToken([namespace, iri]) {
    return new PrefixToken(namespace, new IRIRefToken(iri));
}

class QueryObject {
    constructor(queryContainer, id) {
        this._queryContainer = queryContainer;
        this._resource = isBNodeLabel(id)
            ? new BlankNodeToken(id)
            : this._queryContainer.compactIRI(id);
    }
    getToken() {
        return this._resource;
    }
    toString() {
        return `${this._resource}`;
    }
}

class QueryValue {
    constructor(queryContainer, value) {
        this._value = value;
        this._queryContainer = queryContainer;
        if (isDate(value)) {
            this.withType(XSD.dateTime);
        }
        else {
            this._literal = new LiteralToken(value);
        }
    }
    withType(type) {
        if (XSD.hasOwnProperty(type))
            type = XSD[type];
        const value = this._queryContainer.serializeLiteral(type, this._value);
        const typeToken = this._queryContainer.compactIRI(type);
        this._literal = new RDFLiteralToken(value, typeToken);
        return this;
    }
    withLanguage(language) {
        const value = this._queryContainer.serializeLiteral(XSD.string, this._value);
        const languageToken = new LanguageToken(language);
        this._literal = new RDFLiteralToken(value, languageToken);
        return this;
    }
    getToken() {
        return this._literal;
    }
    toString() {
        return `${this._literal}`;
    }
}

class QueryDocumentBuilder {
    constructor(queryContainer, queryProperty) {
        this.inherit = QueryDocumentBuilder.INHERIT;
        this.all = QueryDocumentBuilder.ALL;
        this._queryContainer = queryContainer;
        this._queryProperty = queryProperty;
    }
    property(name) {
        let parent = this._queryProperty;
        while (parent) {
            const property = parent.getProperty(name, { create: true });
            if (property)
                return property.identifier;
            parent = parent.parent;
        }
        throw new IllegalArgumentError(`The property "${name}" was not declared.`);
    }
    value(value) {
        return new QueryValue(this._queryContainer, value);
    }
    object(object) {
        const id = Pointer.getID(object);
        return new QueryObject(this._queryContainer, id);
    }
    withType(type) {
        if (this._queryProperty.hasProperties())
            throw new IllegalStateError("Types must be specified before the properties.");
        this._queryProperty.addType(type);
        return this;
    }
    properties(propertiesSchema) {
        if (propertiesSchema === QueryDocumentBuilder.ALL) {
            this._queryProperty.setType(QueryPropertyType.ALL);
            return this;
        }
        if (propertiesSchema === QueryDocumentBuilder.FULL) {
            this._queryProperty.setType(QueryPropertyType.FULL);
            return this;
        }
        this._queryProperty.setType(QueryPropertyType.PARTIAL);
        for (const propertyName in propertiesSchema) {
            const queryPropertySchema = propertiesSchema[propertyName];
            const querySchemaProperty = isObject(queryPropertySchema)
                ? queryPropertySchema : { "@id": queryPropertySchema };
            const property = this._queryProperty
                .addProperty(propertyName, querySchemaProperty);
            const subQuery = querySchemaProperty.query;
            if (!subQuery)
                continue;
            const builder = new SubQueryDocumentsBuilder(this._queryContainer, property);
            if (builder !== subQuery.call(void 0, builder))
                throw new IllegalArgumentError("The provided query builder was not returned");
        }
        return this;
    }
}
QueryDocumentBuilder.ALL = Object.freeze({});
QueryDocumentBuilder.FULL = Object.freeze({});
QueryDocumentBuilder.INHERIT = Object.freeze({});
class SubQueryDocumentsBuilder extends QueryDocumentBuilder {
    filter(constraint) {
        this._queryProperty
            .addFilter(constraint);
        return this;
    }
    values(...values) {
        const tokens = values
            .map(value => {
            const token = value.getToken();
            if (token.token === "blankNode")
                throw new IllegalArgumentError(`Cannot assign blank nodes ("${token.label}").`);
            if (this._queryProperty.definition.literal) {
                if (token.token !== "literal")
                    throw new IllegalArgumentError(`"${token}" is not a literal value.`);
            }
            if (this._queryProperty.definition.pointerType !== null) {
                if (token.token === "literal")
                    throw new IllegalArgumentError(`"${token}" is not a resource value.`);
            }
            return token;
        });
        this._queryProperty.addValues(tokens);
        this._queryProperty.setObligatory({ inheritParents: true });
        return this;
    }
}

class QueryDocumentsBuilder extends SubQueryDocumentsBuilder {
    constructor(queryContainer, queryProperty) {
        super(queryContainer, queryProperty);
    }
    orderBy(property, flow) {
        this._queryProperty.setOrder({
            path: property,
            flow: parseFlowString(flow),
        });
        return this;
    }
    limit(limit) {
        this._queryProperty.setLimit(limit);
        return this;
    }
    offset(offset) {
        this._queryProperty.setOffset(offset);
        return this;
    }
}
function parseFlowString(flow) {
    if (flow === void 0)
        return;
    const upperCase = flow
        .toUpperCase();
    switch (upperCase) {
        case "ASC":
        case "DESC":
            return upperCase;
        case "ASCENDING":
        case "DESCENDING":
            return upperCase
                .slice(0, -6);
        default:
            throw new IllegalArgumentError("Invalid flow order.");
    }
}

const VolatileResource = {
    TYPE: C.VolatileResource,
    is(value) {
        return Resource.is(value)
            && value.$hasType(VolatileResource.TYPE);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return VolatileResource.createFrom(copy);
    },
    createFrom(object) {
        const resource = Resource.createFrom(object);
        resource.$addType(VolatileResource.TYPE);
        return resource;
    },
};

const SCHEMA$1 = {
    "targets": {
        "@id": C.target,
        "@type": "@id",
        "@container": "@set",
    },
};
const QueryMetadata = {
    TYPE: C.QueryMetadata,
    SCHEMA: SCHEMA$1,
    is(value) {
        return VolatileResource.is(value)
            && value.$hasType(QueryMetadata.TYPE);
    },
};

class QueryableProperty {
    constructor(data) {
        this.definition = data.definition;
        this.pathBuilderFn = data.pathBuilderFn;
        this.propertyType = data.propertyType;
        this.optional = data.optional;
        this.subProperties = new Map();
        this.values = data.values
            ? data.values
            : [];
    }
    setType(type) {
        this.propertyType = _getBestType(this.propertyType, type);
    }
    setProperty(propertyName, property) {
        this.subProperties.set(propertyName, property);
    }
    getProperty(propertyName, data) {
        if (!this.subProperties.has(propertyName)) {
            if (!data)
                throw new Error(`Property "${propertyName}" doesn't exists.`);
            const property = new QueryableProperty(data);
            this.subProperties.set(propertyName, property);
            return property;
        }
        else {
            const property = this.subProperties.get(propertyName);
            if (data)
                property
                    .mergeData(propertyName, data);
            return property;
        }
    }
    mergeData(propertyName, data) {
        if (this === data)
            return;
        this.setType(data.propertyType);
        this.__mergeDefinition(propertyName, data.definition);
    }
    __mergeDefinition(propertyName, newDefinition) {
        for (const key in newDefinition) {
            const oldValue = this.definition[key];
            const newValue = newDefinition[key];
            if (oldValue === null)
                this.definition[key] = newValue;
            if (newValue !== oldValue) {
                throw new IllegalArgumentError(`Property "${propertyName}" has different "${key}": "${oldValue}", "${newValue}".`);
            }
        }
    }
    getSchema() {
        const schema = new DigestedObjectSchema();
        this.subProperties.forEach((property, propertyName) => {
            schema.properties.set(propertyName, property.definition);
        });
        return schema;
    }
}

class QueryableRootProperty extends QueryableProperty {
    constructor({ uri, propertyType }) {
        super({
            definition: new DigestedObjectSchemaProperty(),
            propertyType: propertyType,
            optional: false,
            values: [new IRIRefToken(uri)],
        });
    }
    __mergeDefinition(propertyName, newDefinition) {
        return;
    }
}

class QueryResultCompacter {
    get jsonldConverter() {
        return this.queryContainer.context.jsonldConverter;
    }
    constructor(registry, queryContainer) {
        this.registry = registry;
        this.queryContainer = queryContainer;
    }
    compactDocuments(rdfDocuments, targetDocuments) {
        if (!targetDocuments)
            targetDocuments = rdfDocuments.map(x => x["@id"]);
        const compactionMap = new Map();
        rdfDocuments.forEach(rdfDocument => {
            const document = this.registry.getPointer(rdfDocument["@id"], true);
            if (!document.$_queryableMetadata) {
                document.$_queryableMetadata = new QueryableRootProperty({
                    uri: document.$id,
                    propertyType: QueryPropertyType.PARTIAL,
                });
            }
            const previousFragments = new Set();
            document
                .$getPointers(true)
                .forEach(pointer => previousFragments.add(pointer.$id));
            rdfDocument["@graph"].forEach(rdfNode => {
                const nodeID = rdfNode["@id"];
                const resource = nodeID !== rdfDocument["@id"]
                    ? document.$getPointer(nodeID, true)
                    : document;
                compactionMap.set(nodeID, {
                    node: rdfNode,
                    document: document,
                    resource: resource,
                });
                previousFragments.delete(nodeID);
            });
            previousFragments
                .forEach(pointer => document.$removePointer(pointer));
        });
        targetDocuments.forEach(documentID => {
            const compactionNode = compactionMap.get(documentID);
            if (!compactionNode)
                throw new IllegalArgumentError(`Invalid data provided.`);
            const queryProperty = this.queryContainer._queryProperty;
            const metadataProperty = compactionNode.resource.$_queryableMetadata;
            this.__processNode(compactionMap, compactionNode, queryProperty, metadataProperty);
        });
        compactionMap.forEach(({ node, resource, document, isCompacted }) => {
            if (!isCompacted) {
                const targetNode = Object.assign({}, node, { [C.document]: undefined, [C.checksum]: undefined });
                const targetSchema = this.queryContainer.context.registry.getSchemaFor(targetNode);
                this.jsonldConverter.update(resource, targetNode, targetSchema, document);
                resource.$_queryableMetadata = void 0;
            }
            this.registry.decorate(resource);
        });
        rdfDocuments
            .map(RDFNode.getID)
            .map(id => compactionMap.get(id))
            .filter(_isExistingValue)
            .forEach(({ resource, node }) => {
            resource.$_syncSnapshot();
            const rawValues = node[C.checksum];
            if (!rawValues || typeof rawValues === "string")
                return;
            const [eTag] = RDFNode.getPropertyLiterals(rawValues, XSD.string);
            if (!eTag)
                return;
            resource.$eTag = `"${eTag}"`;
            resource.$_resolved = true;
        });
        return targetDocuments.map(id => {
            return compactionMap
                .get(id)
                .resource;
        });
    }
    __processNode(compactionMap, compactionNode, queryProperty, metadataProperty) {
        const { node, document, resource } = compactionNode;
        compactionNode.isCompacted = true;
        const targetSchema = queryProperty.getSchemaFor(node);
        const pointerLibrary = __createPointerLibrary(compactionMap, document);
        const targetNode = Object.assign({}, node, { [C.document]: undefined, [C.checksum]: undefined });
        this.jsonldConverter
            .update(resource, targetNode, targetSchema, pointerLibrary, !queryProperty._isComplete());
        if (!queryProperty._isPartial()) {
            resource.$_queryableMetadata = void 0;
            return;
        }
        queryProperty.subProperties.forEach((subQueryProperty, propertyName) => {
            if (resource.hasOwnProperty(propertyName) && subQueryProperty.pathBuilderFn) {
                Object.defineProperty(resource, propertyName, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                });
            }
            const subMetadataProperty = metadataProperty
                .getProperty(propertyName, subQueryProperty);
            if (!resource.hasOwnProperty(propertyName))
                return;
            if (subQueryProperty.propertyType === void 0)
                return;
            const values = Array.isArray(resource[propertyName])
                ? resource[propertyName]
                : [resource[propertyName]];
            values.forEach(value => {
                if (!Pointer.is(value))
                    return;
                const subCompactionNode = compactionMap.get(value.$id);
                if (!subCompactionNode)
                    throw new IllegalArgumentError(`Invalid data provided.`);
                if (subCompactionNode.resource.$_queryableMetadata) {
                    subCompactionNode.resource.$_queryableMetadata
                        .mergeData(propertyName, subMetadataProperty);
                    if (subCompactionNode.document === document && !subCompactionNode.isCompacted) {
                        metadataProperty
                            .setProperty(propertyName, subCompactionNode.resource.$_queryableMetadata);
                    }
                    else {
                        subMetadataProperty.propertyType = void 0;
                    }
                }
                else {
                    if (subCompactionNode.document === document) {
                        subCompactionNode.resource.$_queryableMetadata = subMetadataProperty;
                    }
                    else {
                        subCompactionNode.resource.$_queryableMetadata = new QueryableProperty({
                            propertyType: subMetadataProperty.propertyType,
                            optional: subMetadataProperty.optional,
                            definition: Object.assign(new DigestedObjectSchemaProperty(), subMetadataProperty.definition, {
                                uri: null,
                            }),
                        });
                        subMetadataProperty.propertyType = void 0;
                    }
                }
                this.__processNode(compactionMap, subCompactionNode, subQueryProperty, subCompactionNode.resource.$_queryableMetadata);
            });
        });
    }
}
function __createPointerLibrary(compactionMap, document) {
    return {
        hasPointer(id) {
            if (compactionMap.has(id))
                return true;
            return document.$hasPointer(id);
        },
        getPointer(id) {
            if (compactionMap.has(id))
                return compactionMap
                    .get(id)
                    .resource;
            return document
                .$getPointer(id);
        },
    };
}

//# sourceMappingURL=QueryResultCompacter.js.map

class StringParser {
    parse(body) {
        return new Promise(resolve => resolve(body));
    }
}

class SPARQLRawResultsParser extends JSONParser {
    parse(input) {
        return super.parse(input).then(object => object);
    }
}

class SPARQLService {
    static executeRawASKQuery(url, askQuery, options = {}) {
        options = Object.assign(options, SPARQLService.DEFAULT_OPTIONS);
        RequestUtils.setAcceptHeader("application/sparql-results+json", options);
        RequestUtils.setContentTypeHeader("application/sparql-query", options);
        return RequestService.post(url, askQuery, options, SPARQLService.RESULTS_PARSER);
    }
    static executeASKQuery(url, askQuery, options = {}) {
        return SPARQLService
            .executeRawASKQuery(url, askQuery, options)
            .then(([rawResults, response]) => {
            return [rawResults.boolean, response];
        });
    }
    static executeRawSELECTQuery(url, selectQuery, options = {}) {
        options = Object.assign(options, SPARQLService.DEFAULT_OPTIONS);
        RequestUtils.setAcceptHeader("application/sparql-results+json", options);
        RequestUtils.setContentTypeHeader("application/sparql-query", options);
        return RequestService.post(url, selectQuery, options, SPARQLService.RESULTS_PARSER);
    }
    static executeSELECTQuery(url, selectQuery, pointerLibrary, options = {}) {
        return SPARQLService
            .executeRawSELECTQuery(url, selectQuery, options)
            .then(([rawResults, response]) => {
            let rawBindings = rawResults.results.bindings;
            let bindings = [];
            for (let bindingColumn of rawBindings) {
                let binding = {};
                for (let bindingRow in bindingColumn) {
                    let bindingCell = bindingColumn[bindingRow];
                    binding[bindingRow] = SPARQLService.__parseRawBindingProperty(bindingCell, pointerLibrary);
                }
                bindings.push(binding);
            }
            const results = {
                vars: rawResults.head.vars,
                bindings: bindings,
            };
            return [results, response];
        });
    }
    static executeRawCONSTRUCTQuery(url, constructQuery, options = {}) {
        options = Object.assign(options, SPARQLService.DEFAULT_OPTIONS);
        RequestUtils.setAcceptHeader("application/ld+json", options);
        RequestUtils.setContentTypeHeader("application/sparql-query", options);
        return RequestService.post(url, constructQuery, options, SPARQLService.STRING_PARSER);
    }
    static executeRawDESCRIBEQuery(url, describeQuery, options = {}) {
        options = Object.assign(options, SPARQLService.DEFAULT_OPTIONS);
        RequestUtils.setAcceptHeader("application/ld+json", options);
        RequestUtils.setContentTypeHeader("application/sparql-query", options);
        return RequestService.post(url, describeQuery, options, SPARQLService.STRING_PARSER);
    }
    static executeUPDATE(url, updateQuery, options = {}) {
        options = Object.assign(options, SPARQLService.DEFAULT_OPTIONS);
        RequestUtils.setAcceptHeader("application/ld+json", options);
        RequestUtils.setContentTypeHeader("application/sparql-update", options);
        return RequestService.post(url, updateQuery, options);
    }
    static __parseRawBindingProperty(rawBindingProperty, pointerLibrary) {
        switch (rawBindingProperty.type) {
            case "uri":
                return _getPointer(pointerLibrary, rawBindingProperty.value);
            case "bnode":
                throw new NotImplementedError("BNodes cannot be queried directly");
            case "literal":
                if ("datatype" in rawBindingProperty) {
                    return RDFLiteral.parse(rawBindingProperty.value, rawBindingProperty.datatype);
                }
                else {
                    return RDFLiteral.parse(rawBindingProperty.value);
                }
            default:
                throw new IllegalArgumentError("The bindingProperty has an unsupported type");
        }
    }
}
SPARQLService.DEFAULT_OPTIONS = {};
SPARQLService.RESULTS_PARSER = new SPARQLRawResultsParser();
SPARQLService.STRING_PARSER = new StringParser();

const SCHEMA$2 = {
    "targetMembers": {
        "@id": C.targetMember,
        "@type": "@id",
        "@container": "@set",
    },
};
const AddMemberAction = {
    TYPE: C.AddMemberAction,
    SCHEMA: SCHEMA$2,
    is(value) {
        return Resource.is(value)
            && value.$hasType(AddMemberAction.TYPE);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return AddMemberAction.createFrom(copy);
    },
    createFrom(object) {
        const resource = Resource.createFrom(object);
        resource.$addType(AddMemberAction.TYPE);
        return resource;
    },
};

const SCHEMA$3 = {
    "targetMembers": {
        "@id": C.targetMember,
        "@type": "@id",
        "@container": "@set",
    },
};
const RemoveMemberAction = {
    TYPE: C.RemoveMemberAction,
    SCHEMA: SCHEMA$3,
    is(value) {
        return Resource.is(value)
            && value.$hasType(RemoveMemberAction.TYPE);
    },
    create(data) {
        const copy = Object.assign({}, data);
        return RemoveMemberAction.createFrom(copy);
    },
    createFrom(object) {
        const resource = Resource.createFrom(object);
        resource.$addType(RemoveMemberAction.TYPE);
        return resource;
    },
};

const SCHEMA$4 = {
    "documentsMetadata": {
        "@id": C.documentMetadata,
        "@type": "@id",
        "@container": "@set",
    },
};
const ResponseMetadata = {
    TYPE: C.ResponseMetadata,
    SCHEMA: SCHEMA$4,
    is(object) {
        return VolatileResource.is(object)
            && object.$hasType(ResponseMetadata.TYPE);
    },
};

class LDPatchToken {
    constructor() {
        this.token = "ldpatch";
        this.prologues = [];
        this.statements = [];
    }
    toString() {
        const tokens = [
            ...this.prologues,
            ...this.statements,
        ];
        return tokens.join(" ");
    }
}
class PrefixToken$1 {
    constructor(namespace, iri) {
        this.token = "prefix";
        this.namespace = namespace;
        this.iri = iri;
    }
    toString() {
        return `@prefix ${this.namespace}: ${this.iri}.`;
    }
}
class AddToken {
    constructor() {
        this.token = "add";
        this.triples = [];
    }
    toString() {
        return `Add { ${this.triples.join(". ")}. }.`;
    }
}
class DeleteToken {
    constructor() {
        this.token = "delete";
        this.triples = [];
    }
    toString() {
        return `Delete { ${this.triples.join(". ")}. }.`;
    }
}
class UpdateListToken {
    constructor(subject, predicate, slice, collection) {
        this.token = "updateList";
        this.subject = subject;
        this.predicate = predicate;
        this.slice = slice;
        this.collection = collection;
    }
    toString() {
        return `UpdateList ${this.subject} ${this.predicate} ${this.slice} ${this.collection}.`;
    }
}
class SliceToken {
    constructor(minIndex, maxIndex) {
        this.token = "slice";
        if (isNumber(minIndex))
            this.minIndex = minIndex;
        if (isNumber(maxIndex))
            this.maxIndex = maxIndex;
    }
    toString() {
        let buffer = "..";
        if (this.minIndex !== void 0)
            buffer = this.minIndex + buffer;
        if (this.maxIndex !== void 0)
            buffer = buffer + this.maxIndex;
        return buffer;
    }
}

const typesDefinition = new DigestedObjectSchemaProperty();
typesDefinition.literal = false;
typesDefinition.pointerType = PointerType.ID;
typesDefinition.containerType = ContainerType.SET;
class DeltaCreator {
    constructor(context) {
        this.prefixesMap = new Map();
        this.context = context;
        this.addToken = new AddToken();
        this.deleteToken = new DeleteToken();
        this.updateLists = [];
    }
    getPatch() {
        const patch = new LDPatchToken();
        this.prefixesMap.forEach(prefix => patch.prologues.push(prefix));
        patch.statements.push(...this.updateLists);
        if (this.addToken.triples.length)
            patch.statements.push(this.addToken);
        if (this.deleteToken.triples.length)
            patch.statements.push(this.deleteToken);
        return `${patch}`;
    }
    addResource(id, previousResource, currentResource) {
        const schema = this.__getSchema(id, previousResource, currentResource);
        const resource = isBNodeLabel(id) ?
            new BlankNodeToken(id) : this.__compactIRI(schema, id);
        const updateLists = [];
        const addTriples = new SubjectToken(resource);
        const deleteTriples = new SubjectToken(resource);
        new Set([
            "types",
            ...Object.keys(previousResource),
            ...Object.keys(currentResource),
        ]).forEach(propertyName => {
            if (propertyName === "$id")
                return;
            const predicateURI = propertyName === "types" ?
                "a" : this._getPropertyIRI(schema, propertyName);
            const definition = predicateURI === "a" ?
                typesDefinition : schema.getProperty(propertyName);
            const oldValue = previousResource[propertyName];
            const newValue = currentResource[propertyName];
            if (definition && definition.containerType === ContainerType.LIST && _isExistingValue(oldValue)) {
                const listUpdates = [];
                if (!_isExistingValue(newValue)) {
                    deleteTriples.addProperty(new PropertyToken(predicateURI).addObject(new CollectionToken()));
                    listUpdates.push({ slice: [0, void 0], objects: [] });
                }
                else {
                    definition.containerType = ContainerType.SET;
                    listUpdates.push(...__getListDelta(this.__getObjects(oldValue, schema, definition), this.__getObjects(newValue, schema, definition)));
                }
                if (!listUpdates.length)
                    return;
                this.__addPrefixFrom(predicateURI, schema);
                listUpdates.forEach(updateDelta => {
                    const collection = new CollectionToken();
                    updateDelta.objects.forEach(object => {
                        collection.addObject(object);
                        this.__addPrefixFrom(object, schema);
                    });
                    updateLists.push(new UpdateListToken(resource, predicateURI, updateDelta.objects.length ?
                        new SliceToken(updateDelta.slice[0], updateDelta.slice[0]) :
                        new SliceToken(...updateDelta.slice), collection));
                });
            }
            else {
                const oldObjects = this.__getObjects(oldValue, schema, definition);
                const newObjects = this.__getObjects(newValue, schema, definition);
                const setDelta = __getArrayDelta(oldObjects, newObjects);
                const addValues = (objects, triple) => {
                    if (!objects.length)
                        return;
                    const property = new PropertyToken(predicateURI);
                    objects.forEach(object => {
                        property.addObject(object);
                        this.__addPrefixFrom(object, schema);
                    });
                    triple.addProperty(property);
                };
                addValues(setDelta.toAdd, addTriples);
                addValues(setDelta.toDelete, deleteTriples);
            }
        });
        this.updateLists.push(...updateLists);
        updateLists.forEach(x => this.__addPrefixFrom(x.predicate, schema));
        if (addTriples.properties.length)
            this.addToken.triples.push(addTriples);
        addTriples.properties.forEach(x => this.__addPrefixFrom(x.verb, schema));
        if (deleteTriples.properties.length)
            this.deleteToken.triples.push(deleteTriples);
        deleteTriples.properties.forEach(x => this.__addPrefixFrom(x.verb, schema));
        this.__addPrefixFrom(resource, schema);
    }
    __getSchema($id, previousResource, currentResource) {
        const typesSet = new Set();
        if ("types" in previousResource)
            previousResource
                .types.forEach(typesSet.add, typesSet);
        if ("types" in currentResource)
            currentResource
                .types.forEach(typesSet.add, typesSet);
        const mergedResource = { $id, types: Array.from(typesSet) };
        const baseSchema = this.context.registry
            .getSchemaFor(mergedResource);
        const queryableProperty = previousResource.$_queryableMetadata || previousResource.$_queryableMetadata;
        if (!queryableProperty)
            return baseSchema;
        return ObjectSchemaDigester._combineSchemas([
            baseSchema,
            queryableProperty.getSchema(),
        ]);
    }
    _getPropertyIRI(schema, propertyName) {
        const propertyDefinition = schema.properties.get(propertyName);
        const uri = propertyDefinition && propertyDefinition.uri ?
            propertyDefinition.uri :
            propertyName;
        return this.__compactIRI(schema, uri);
    }
    __getObjects(value, schema, definition) {
        const values = (Array.isArray(value) ?
            !definition || definition.containerType !== null ? value : value.slice(0, 1) :
            [value]).filter(_isExistingValue);
        if (definition && definition.containerType === ContainerType.LIST) {
            if (!_isExistingValue(value))
                return [];
            const collection = new CollectionToken();
            collection.objects.push(...this.__expandValues(values, schema, definition));
            return [collection];
        }
        if (definition && definition.containerType === ContainerType.LANGUAGE) {
            return this.__expandLanguageMap(values, schema);
        }
        return this.__expandValues(values, schema, definition);
    }
    __expandValues(values, schema, definition) {
        const areDefinedLiteral = definition && definition.literal !== null ? definition.literal : null;
        return values
            .map(value => {
            const isLiteral = areDefinedLiteral !== null ? areDefinedLiteral : !Pointer.is(value);
            if (isLiteral)
                return this.__expandLiteral(value, schema, definition);
            return this.__expandPointer(value, schema);
        })
            .filter(_isExistingValue);
    }
    __expandLanguageMap(values, schema) {
        if (!values.length)
            return [];
        const languageMap = values[0];
        return Object
            .keys(languageMap)
            .map(key => {
            const value = languageMap[key];
            const tempDefinition = new DigestedObjectSchemaProperty();
            tempDefinition.language = key;
            tempDefinition.literalType = XSD.string;
            return this.__expandLiteral(value, schema, tempDefinition);
        })
            .filter(_isExistingValue);
    }
    __expandPointer(value, schema) {
        const id = Pointer.is(value) ? value.$id : value;
        if (!isString(id))
            return null;
        return isBNodeLabel(id) ?
            new BlankNodeToken(id) :
            this.__compactIRI(schema, id);
    }
    __expandLiteral(value, schema, definition) {
        const type = definition && definition.literalType ?
            definition.literalType :
            _guessXSDType(value);
        if (type === null || !this.context.jsonldConverter.literalSerializers.has(type))
            return null;
        value = this.context.jsonldConverter.literalSerializers.get(type).serialize(value);
        if (type !== XSD.string)
            return new RDFLiteralToken(value, this.__compactIRI(schema, type));
        if (definition && typeof definition.language === "string")
            return new RDFLiteralToken(value, new LanguageToken(definition.language));
        return new LiteralToken(value);
    }
    __compactIRI(schema, iri) {
        iri = schema.resolveURI(iri, { vocab: true });
        const matchPrefix = Array.from(schema.prefixes.entries())
            .find(([, prefixURI]) => iri.startsWith(prefixURI));
        if (!matchPrefix)
            return new IRIRefToken(iri);
        return new PrefixedNameToken(matchPrefix[0], iri.substr(matchPrefix[1].length));
    }
    __addPrefixFrom(object, schema) {
        if (object === "a")
            return;
        if ("objects" in object)
            return object.objects.forEach(collectionObject => {
                this.__addPrefixFrom(collectionObject, schema);
            });
        if ("type" in object)
            return this.__addPrefixFrom(object.type, schema);
        if (object.token !== "prefixedName")
            return;
        const namespace = object.namespace;
        if (this.prefixesMap.has(namespace))
            return;
        const iri = schema.prefixes.get(namespace);
        this.prefixesMap.set(namespace, new PrefixToken$1(namespace, new IRIRefToken(iri)));
    }
}
function __getArrayDelta(oldValues, newValues) {
    const objectMapper = object => [`${object}`, object];
    const toAdd = new Map(newValues.map(objectMapper));
    const toDelete = new Map(oldValues.map(objectMapper));
    toAdd.forEach((value, identifier) => {
        if (!toDelete.has(identifier))
            return;
        toDelete.delete(identifier);
        toAdd.delete(identifier);
    });
    return {
        toAdd: Array.from(toAdd.values()),
        toDelete: Array.from(toDelete.values()),
    };
}
function __getListDelta(oldValues, newValues) {
    const nodeMapper = (object, index) => ({
        identifier: `${object}`,
        object,
        index,
    });
    const oldPositions = oldValues.map(nodeMapper);
    const newPositions = newValues.map(nodeMapper);
    const addsSet = new Set(newPositions);
    const deletes = [];
    let offset = 0;
    let remnants = newPositions;
    oldPositions.forEach(oldNode => {
        const currentIndex = remnants.findIndex(newNode => newNode.identifier === oldNode.identifier);
        if (currentIndex === -1) {
            oldNode.index -= offset++;
            deletes.push(oldNode);
        }
        else {
            addsSet.delete(remnants[currentIndex]);
            remnants = remnants.slice(currentIndex + 1);
        }
    });
    const updates = [];
    let last;
    deletes.forEach(node => {
        if (last && last.slice[0] === node.index) {
            last.slice = [last.slice[0], last.slice[1] + 1];
            return;
        }
        updates.push(last = {
            slice: [node.index, node.index + 1],
            objects: [],
        });
    });
    last = void 0;
    addsSet.forEach(node => {
        if (last && last.slice[1] === node.index) {
            last.slice = [last.slice[0], node.index + 1];
            last.objects.push(node.object);
            return;
        }
        updates.push(last = {
            slice: [node.index, node.index + 1],
            objects: [node.object],
        });
    });
    return updates;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

const HTTPRepositoryTrait = {
    PROTOTYPE: {
        get(uri, requestOptions) {
            if (!this.context.registry.inScope(uri, true))
                return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            if (this.context.registry.hasPointer(url, true)) {
                const resource = this.context.registry.getPointer(url, true);
                if (resource.$isResolved() && !(requestOptions && requestOptions.ensureLatest))
                    return Promise.resolve(resource);
            }
            return RequestService
                .get(url, requestOptions)
                .then((response) => {
                return this._parseResponseData(response, url);
            });
        },
        resolve(resource, requestOptions) {
            return this.get(resource.$id, requestOptions);
        },
        exists(uri, requestOptions) {
            if (!this.context.registry.inScope(uri, true))
                return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            return RequestService
                .head(url, requestOptions)
                .then(() => true)
                .catch((error) => {
                if ("response" in error && error.response.status === 404)
                    return false;
                return Promise.reject(error);
            });
        },
        refresh(resource, requestOptions) {
            if (!ResolvablePointer.is(resource))
                return Promise.reject(new IllegalArgumentError("The resource isn't a resolvable pointer."));
            if (!this.context.registry.inScope(resource.$id, true))
                return Promise.reject(new IllegalArgumentError(`"${resource.$id}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(resource.$id, { base: true });
            return RequestService
                .get(url, requestOptions)
                .then((response) => {
                return this._parseResponseData(response, url);
            })
                .catch((error) => {
                if ("response" in error && error.response.status === 304)
                    return resource;
                return Promise.reject(error);
            });
        },
        save(resource, requestOptions) {
            if (!ResolvablePointer.is(resource))
                return Promise.reject(new IllegalArgumentError("The resource isn't a resolvable pointer."));
            if (!this.context.registry.inScope(resource.$id, true))
                return Promise.reject(new IllegalArgumentError(`"${resource.$id}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(resource.$id, { base: true });
            if (!resource.$isDirty())
                return Promise.resolve(resource);
            const body = JSON.stringify(resource);
            return RequestService
                .put(url, body, requestOptions)
                .then(() => resource);
        },
        saveAndRefresh(resource, requestOptions) {
            return this
                .save(resource, requestOptions)
                .then(() => this.refresh(resource, requestOptions));
        },
        delete(uri, requestOptions) {
            if (!this.context.registry.inScope(uri, true))
                return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            return RequestService
                .delete(url, requestOptions)
                .then(() => {
                this.context.registry.removePointer(url);
            });
        },
        _parseResponseData(response, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const resolvable = this.context.registry
                    .getPointer(id, true);
                resolvable.$eTag = response.getETag();
                resolvable.$_resolved = true;
                return resolvable;
            });
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(HTTPRepositoryTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (HTTPRepositoryTrait.isDecorated(object))
            return object;
        const resource = ModelDecorator
            .decorateMultiple(object, GeneralRepository);
        return ModelDecorator
            .definePropertiesFrom(HTTPRepositoryTrait.PROTOTYPE, resource);
    },
};

const __JSONLD_PARSER = new JSONLDParser();
function __setDefaultRequestOptions(requestOptions, interactionModel) {
    if (interactionModel)
        RequestUtils.setPreferredInteractionModel(interactionModel, requestOptions);
    RequestUtils.setAcceptHeader("application/ld+json", requestOptions);
}
function __getTargetID(id, response) {
    const locationHeader = response.getHeader("Content-Location");
    if (!locationHeader)
        return id;
    if (locationHeader.values.length !== 1)
        throw new BadResponseError("The response must contain one Content-Location header.", response);
    const locationString = "" + locationHeader;
    if (!locationString)
        throw new BadResponseError(`The response doesn't contain a valid 'Content-Location' header.`, response);
    return locationString;
}
function __getErrorResponseParserFnFrom(repository) {
    return _getErrorResponseParserFn(repository.context.registry);
}
function __changeNodesID(resource, map) {
    map
        .entries
        .forEach(({ entryKey, entryValue }) => {
        const node = resource
            .$getPointer(entryKey.$id, true);
        resource.$removePointer(entryKey.$id);
        node.$id = entryValue.$id;
        resource.$_addPointer(node);
    });
}
function __applyResponseMetadata(repository, freeNodes) {
    if (!freeNodes.length)
        return;
    const freeResources = FreeResources.parseFreeNodes(repository.context.registry, freeNodes);
    const responseMetadata = freeResources
        .getPointers(true)
        .find(ResponseMetadata.is);
    if (!responseMetadata)
        return;
    responseMetadata
        .documentsMetadata
        .forEach(metadata => __changeNodesID(metadata.relatedDocument, metadata.bNodesMap));
}
function __applyResponseRepresentation(repository, resource, response) {
    if (response.status === 204 || !response.data)
        return resource;
    return __JSONLD_PARSER
        .parse(response.data)
        .then((expandedResult) => {
        const freeNodes = RDFDocument.getFreeNodes(expandedResult);
        __applyResponseMetadata(repository, freeNodes);
        const preferenceHeader = response.getHeader("Preference-Applied");
        if (preferenceHeader === null || !preferenceHeader.hasValue("return=representation"))
            return resource;
        return repository._parseResponseData(response, resource.$id);
    });
}
function __isInvalidChild(child) {
    return ResolvablePointer.is(child);
}
function __isPersistingChild(object) {
    return object["__CarbonLDP_persisting__"];
}
function __createChild(repository, parentURI, requestOptions, child, slug) {
    if (ResolvablePointer.is(child))
        throw new IllegalArgumentError("Cannot persist an already resolvable pointer.");
    const transient = TransientDocument.is(child) ?
        child : TransientDocument.decorate(child);
    transient.$_normalize();
    transient.$registry = repository.context.registry;
    const body = JSON.stringify(transient);
    if (!!slug)
        RequestUtils.setSlug(slug, requestOptions);
    Object.defineProperty(transient, "__CarbonLDP_persisting__", { configurable: true, value: true });
    return RequestService
        .post(parentURI, body, requestOptions)
        .then((response) => {
        delete transient["__CarbonLDP_persisting__"];
        const locationHeader = response.getHeader("Location");
        if (locationHeader === null || locationHeader.values.length < 1)
            throw new BadResponseError("The response is missing a Location header.", response);
        if (locationHeader.values.length !== 1)
            throw new BadResponseError("The response contains more than one Location header.", response);
        transient.$id = locationHeader.values[0].toString();
        const document = repository.context.registry._addPointer(transient);
        document
            .$getFragments()
            .forEach(document.$__modelDecorator.decorate);
        return __applyResponseRepresentation(repository, document, response);
    })
        .catch((error) => {
        delete transient["__CarbonLDP_persisting__"];
        return __getErrorResponseParserFnFrom(repository)(error);
    });
}
function __createChildren(retrievalType, repository, uri, children, slugsOrOptions, requestOptions) {
    if (!repository.context.registry.inScope(uri, true))
        return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
    const url = repository.context.getObjectSchema().resolveURI(uri, { base: true });
    requestOptions = RequestUtils.isOptions(slugsOrOptions) ?
        slugsOrOptions :
        requestOptions ? requestOptions : {};
    const slugs = isString(slugsOrOptions) || Array.isArray(slugsOrOptions) ?
        slugsOrOptions : null;
    __setDefaultRequestOptions(requestOptions, LDP.Container);
    RequestUtils.setPreferredRetrieval(retrievalType, requestOptions);
    RequestUtils.setContentTypeHeader("application/ld+json", requestOptions);
    if (!Array.isArray(children)) {
        if (__isInvalidChild(children))
            return Promise.reject(new IllegalArgumentError(`The object is already a resolvable pointer.`));
        if (__isPersistingChild(children))
            return Promise.reject(new IllegalArgumentError(`The object is already being persisted.`));
        return __createChild(repository, url, requestOptions, children, slugs ? slugs.toString() : undefined);
    }
    const invalidChild = children
        .findIndex(child => __isInvalidChild(child));
    if (invalidChild !== -1)
        return Promise.reject(new IllegalArgumentError(`The object in "${invalidChild}" is already a resolvable pointer.`));
    const persistingChild = children
        .findIndex(child => __isPersistingChild(child));
    if (persistingChild !== -1)
        return Promise.reject(new IllegalArgumentError(`The object in "${persistingChild}" is already being persisted.`));
    const promises = children.map((child, index) => {
        const cloneOptions = RequestUtils.cloneOptions(requestOptions);
        const slug = slugs && index < slugs.length ? slugs[index] : void 0;
        return __createChild(repository, url, cloneOptions, child, slug);
    });
    return Promise.all(promises);
}
function __sendPatch(repository, document, requestOptions) {
    if (!ResolvablePointer.is(document))
        return Promise.reject(new IllegalArgumentError("The document isn't a resolvable pointer."));
    if (!repository.context.registry.inScope(document.$id))
        return Promise.reject(new IllegalArgumentError(`"${document.$id}" is out of scope.`));
    const url = repository.context.getObjectSchema().resolveURI(document.$id, { base: true });
    if (!document.$isDirty())
        return Promise.resolve(document);
    document.$_normalize();
    __setDefaultRequestOptions(requestOptions);
    RequestUtils.setContentTypeHeader("text/ldpatch", requestOptions);
    RequestUtils.setIfMatchHeader(document.$eTag, requestOptions);
    const deltaCreator = new DeltaCreator(repository.context);
    deltaCreator.addResource(document.$id, document.$_snapshot, document);
    document
        .$getPointers(true)
        .forEach((pointer) => {
        deltaCreator.addResource(pointer.$id, pointer.$_snapshot, pointer);
    });
    document.$__savedFragments
        .filter(pointer => !document.$hasPointer(pointer.$id))
        .forEach(pointer => {
        deltaCreator.addResource(pointer.$id, pointer.$_snapshot, {});
    });
    const body = deltaCreator.getPatch();
    return RequestService
        .patch(url, body, requestOptions)
        .then((response) => {
        return __applyResponseRepresentation(repository, document, response);
    })
        .catch(__getErrorResponseParserFnFrom(repository));
}
function __parseMembers(registry, pointers) {
    return pointers
        .map(pointer => {
        if (isString(pointer))
            return registry.getPointer(pointer);
        if (Pointer.is(pointer))
            return pointer;
    })
        .filter((pointer) => !!pointer);
}
function __sendAddAction(repository, uri, members, requestOptions = {}) {
    if (!repository.context.registry.inScope(uri, true))
        return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
    const url = repository.context.getObjectSchema().resolveURI(uri, { base: true });
    __setDefaultRequestOptions(requestOptions, LDP.Container);
    RequestUtils.setContentTypeHeader("application/ld+json", requestOptions);
    const freeResources = FreeResources.createFrom({ registry: repository.context.registry });
    const targetMembers = __parseMembers(repository.context.registry, members);
    freeResources._addPointer(AddMemberAction.createFrom({ targetMembers }));
    const body = JSON.stringify(freeResources);
    return RequestService
        .put(url, body, requestOptions)
        .then(() => { })
        .catch(__getErrorResponseParserFnFrom(repository));
}
function __sendRemoveAction(repository, uri, members, requestOptions = {}) {
    if (!repository.context.registry.inScope(uri, true))
        return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
    const url = repository.context.getObjectSchema().resolveURI(uri, { base: true });
    __setDefaultRequestOptions(requestOptions, LDP.Container);
    RequestUtils.setContentTypeHeader("application/ld+json", requestOptions);
    RequestUtils.setRetrievalPreferences({
        include: [C.PreferSelectedMembershipTriples],
        omit: [C.PreferMembershipTriples],
    }, requestOptions);
    const freeResources = FreeResources.createFrom({ registry: repository.context.registry });
    const targetMembers = __parseMembers(repository.context.registry, members);
    freeResources._addPointer(RemoveMemberAction.createFrom({ targetMembers }));
    const body = JSON.stringify(freeResources);
    return RequestService
        .delete(url, body, requestOptions)
        .then(() => { })
        .catch(__getErrorResponseParserFnFrom(repository));
}
function __sendRemoveAll(repository, uri, requestOptions = {}) {
    if (!repository.context.registry.inScope(uri, true))
        return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
    const url = repository.context.getObjectSchema().resolveURI(uri, { base: true });
    __setDefaultRequestOptions(requestOptions, LDP.Container);
    RequestUtils.setRetrievalPreferences({
        include: [
            C.PreferMembershipTriples,
        ],
        omit: [
            C.PreferMembershipResources,
            C.PreferContainmentTriples,
            C.PreferContainmentResources,
            C.PreferContainer,
        ],
    }, requestOptions);
    return RequestService
        .delete(url, requestOptions)
        .then(() => { })
        .catch(__getErrorResponseParserFnFrom(repository));
}
const LDPDocumentsRepositoryTrait = {
    PROTOTYPE: {
        get(uri, requestOptions = {}) {
            __setDefaultRequestOptions(requestOptions, LDP.RDFSource);
            return HTTPRepositoryTrait.PROTOTYPE
                .get.call(this, uri, requestOptions)
                .catch(__getErrorResponseParserFnFrom(this));
        },
        exists(uri, requestOptions = {}) {
            __setDefaultRequestOptions(requestOptions, LDP.RDFSource);
            return HTTPRepositoryTrait.PROTOTYPE
                .exists.call(this, uri, requestOptions)
                .catch(__getErrorResponseParserFnFrom(this));
        },
        create(uri, children, slugsOrOptions, requestOptions) {
            return __createChildren("minimal", this, uri, children, slugsOrOptions, requestOptions);
        },
        createAndRetrieve(uri, children, slugsOrOptions, requestOptions) {
            return __createChildren("representation", this, uri, children, slugsOrOptions, requestOptions);
        },
        refresh(document, requestOptions = {}) {
            __setDefaultRequestOptions(requestOptions, LDP.RDFSource);
            RequestUtils.setIfNoneMatchHeader(document.$eTag, requestOptions);
            return HTTPRepositoryTrait.PROTOTYPE
                .refresh.call(this, document, requestOptions)
                .catch(__getErrorResponseParserFnFrom(this));
        },
        save(document, requestOptions = {}) {
            RequestUtils.setPreferredRetrieval("minimal", requestOptions);
            return __sendPatch(this, document, requestOptions);
        },
        saveAndRefresh(document, requestOptions = {}) {
            RequestUtils.setPreferredRetrieval("representation", requestOptions);
            return __sendPatch(this, document, requestOptions);
        },
        delete(uri, requestOptions = {}) {
            __setDefaultRequestOptions(requestOptions, LDP.RDFSource);
            return HTTPRepositoryTrait.PROTOTYPE
                .delete.call(this, uri, requestOptions)
                .catch(__getErrorResponseParserFnFrom(this));
        },
        addMember(uri, member, requestOptions) {
            return __sendAddAction(this, uri, [member], requestOptions);
        },
        addMembers(uri, members, requestOptions) {
            return __sendAddAction(this, uri, members, requestOptions);
        },
        removeMember(uri, member, requestOptions) {
            return __sendRemoveAction(this, uri, [member], requestOptions);
        },
        removeMembers(uri, membersOrOptions, requestOptions) {
            if (Array.isArray(membersOrOptions))
                return __sendRemoveAction(this, uri, membersOrOptions, requestOptions);
            return __sendRemoveAll(this, uri, membersOrOptions || requestOptions);
        },
        _parseResponseData(response, id) {
            return __JSONLD_PARSER
                .parse(response.data)
                .then((rdfNodes) => {
                const rdfDocuments = RDFDocument
                    .getDocuments(rdfNodes);
                id = __getTargetID(id, response);
                const rdfDocument = rdfDocuments.find(doc => doc["@id"] === id);
                if (!rdfDocument)
                    throw new BadResponseError(`No document "${id}" was returned.`, response);
                const document = this.context.registry.register(id);
                const previousFragments = new Set();
                document
                    .$getPointers(true)
                    .forEach(pointer => previousFragments.add(pointer.$id));
                const elements = rdfDocument["@graph"].map(node => {
                    const target = document.$getPointer(node["@id"]);
                    const schema = this.context.registry.getSchemaFor(node);
                    this.context.jsonldConverter.update(target, node, schema, document);
                    if ("$document" in target)
                        previousFragments.delete(target.$id);
                    return target;
                });
                previousFragments
                    .forEach(pointer => document.$removePointer(pointer));
                elements.forEach(element => {
                    element.$_syncSnapshot();
                    this.context.registry.decorate(element);
                });
                document.$eTag = response.getETag();
                document.$_resolved = true;
                return document;
            });
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(LDPDocumentsRepositoryTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (LDPDocumentsRepositoryTrait.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, HTTPRepositoryTrait);
        return ModelDecorator
            .definePropertiesFrom(LDPDocumentsRepositoryTrait.PROTOTYPE, target);
    },
};

function __executeQueryBuilder(queryContainer, queryData) {
    const queryBuilder = "containerPropertyType" in queryContainer._queryProperty
        ? new QueryDocumentsBuilder(queryContainer, queryContainer._queryProperty)
        : new QueryDocumentBuilder(queryContainer, queryContainer._queryProperty);
    if (queryData.rootType !== void 0)
        queryContainer._queryProperty
            .setType(queryData.rootType);
    if (queryData.queryBuilderFn && queryData.queryBuilderFn.call(void 0, queryBuilder) !== queryBuilder)
        throw new IllegalArgumentError("The provided query builder was not returned");
}
function __sortQueryDocuments(queryContainer, documents) {
    if (!("order" in queryContainer._queryProperty) || !queryContainer._queryProperty.order)
        return documents;
    const { path, flow } = queryContainer._queryProperty.order;
    const inverter = flow === "DESC" ? -1 : 1;
    return documents.sort((a, b) => {
        a = _getPathProperty(a, path);
        b = _getPathProperty(b, path);
        const aValue = Pointer.is(a) ? a.$id : a;
        const bValue = Pointer.is(b) ? b.$id : b;
        if (aValue === bValue)
            return 0;
        if (aValue === void 0)
            return -1 * inverter;
        if (bValue === void 0)
            return inverter;
        if (!_areDifferentType(a, b)) {
            if (Pointer.is(a)) {
                const aIsBNode = URI.isBNodeID(aValue);
                const bIsBNode = URI.isBNodeID(bValue);
                if (aIsBNode && !bIsBNode)
                    return -1 * inverter;
                if (bIsBNode && !aIsBNode)
                    return inverter;
            }
        }
        else {
            if (Pointer.is(a))
                return -1 * inverter;
            if (Pointer.is(b))
                return inverter;
            if (isNumber(a))
                return -1 * inverter;
            if (isNumber(b))
                return inverter;
            if (isDate(a))
                return -1 * inverter;
            if (isDate(b))
                return inverter;
            if (isBoolean(a))
                return -1 * inverter;
            if (isBoolean(b))
                return inverter;
            if (isString(a))
                return -1 * inverter;
            if (isString(b))
                return inverter;
        }
        if (aValue < bValue)
            return -1 * inverter;
        if (aValue > bValue)
            return inverter;
        return 0;
    });
}
function __requestQueryDocuments(repository, url, requestOptions, queryContainer) {
    const construct = new ConstructToken()
        .addTriple(new SubjectToken(new IRIRefToken(`cldp-sdk://metadata-${UUIDUtils.generate()}`))
        .addProperty(new PropertyToken("a")
        .addObject(queryContainer.compactIRI(C.VolatileResource))
        .addObject(queryContainer.compactIRI(C.QueryMetadata)))
        .addProperty(new PropertyToken(queryContainer.compactIRI(C.target))
        .addObject(queryContainer._queryProperty.identifier)))
        .addTriple(...queryContainer._queryProperty.getConstructPatterns())
        .addPattern(...queryContainer._queryProperty.getSearchPatterns());
    const query = new QueryToken(construct)
        .addPrologues(...queryContainer.getPrologues());
    RequestUtils.setRetrievalPreferences({ include: [C.PreferResultsContexts] }, requestOptions);
    return SPARQLService
        .executeRawCONSTRUCTQuery(url, query.toString(), requestOptions)
        .then(([strConstruct]) => strConstruct)
        .then((jsonldString) => {
        return new JSONLDParser().parse(jsonldString);
    })
        .then((rdfNodes) => {
        const freeNodes = RDFDocument.getFreeNodes(rdfNodes);
        const freeResources = FreeResources
            .parseFreeNodes(repository.context.registry, freeNodes);
        const targetDocuments = freeResources
            .getPointers(true)
            .filter(QueryMetadata.is)
            .map(x => x.targets)
            .reduce((targets, x) => targets.concat(x), [])
            .map(x => x.$id);
        const rdfDocuments = rdfNodes
            .filter(RDFDocument.is);
        return new QueryResultCompacter(repository.context.registry, queryContainer)
            .compactDocuments(rdfDocuments, targetDocuments);
    })
        .then(documents => __sortQueryDocuments(queryContainer, documents))
        .catch(_getErrorResponseParserFn(repository.context.registry));
}
function __requestRelations(repository, uri, requestOptions, queryData) {
    if (!repository.context.registry.inScope(uri, true))
        return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
    const url = repository.context
        .getObjectSchema()
        .resolveURI(uri, { base: true });
    const queryContainer = new QueryContainer(repository.context, {
        containerPropertyType: queryData.containerPropertyType,
        uri: url,
    });
    __executeQueryBuilder(queryContainer, queryData);
    return __requestQueryDocuments(repository, url, requestOptions, queryContainer);
}
function __requestDocuments(repository, uris, requestOptions, queryData) {
    for (const uri of uris) {
        if (!repository.context.registry.inScope(uri, true))
            return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
    }
    const urls = uris.map(uri => repository.context
        .getObjectSchema()
        .resolveURI(uri, { base: true }));
    const queryContainer = new QueryContainer(repository.context, {
        uris: urls,
    });
    __executeQueryBuilder(queryContainer, queryData);
    const url = urls.length === 1 ? urls[0] : repository.context.baseURI;
    RequestUtils.setRetrievalPreferences({ include: [C.PreferDocumentChecksums] }, requestOptions);
    return __requestQueryDocuments(repository, url, requestOptions, queryContainer);
}
function __getQueryable(repository, uri, requestOptions, queryBuilderFn) {
    return __requestDocuments(repository, [uri], requestOptions, { queryBuilderFn })
        .then((documents) => documents[0]);
}
function __addRefreshProperties(parentProperty, queryableProperty) {
    queryableProperty.subProperties.forEach((subProperty, propertyName) => {
        const queryProperty = parentProperty._addSubProperty(propertyName, subProperty);
        __addRefreshProperties(queryProperty, subProperty);
    });
}
function __refreshQueryable(repository, document, requestOptions = {}) {
    if (!repository.context.registry.inScope(document.$id, true))
        return Promise.reject(new IllegalArgumentError(`"${document.$id}" is out of scope.`));
    const url = repository.context
        .getObjectSchema()
        .resolveURI(document.$id, { base: true });
    const queryContainer = new QueryContainer(repository.context, { uris: [url] });
    __addRefreshProperties(queryContainer._queryProperty, document.$_queryableMetadata);
    RequestUtils.setRetrievalPreferences({ include: [C.PreferDocumentChecksums] }, requestOptions);
    return __requestQueryDocuments(repository, url, requestOptions, queryContainer)
        .then((documents) => documents[0]);
}
const QueryableDocumentsRepositoryTrait = {
    PROTOTYPE: {
        get(uriOrURIs, requestOptionsOrQueryBuilderFn, queryBuilderFn) {
            const requestOptions = typeof requestOptionsOrQueryBuilderFn === "object" ?
                requestOptionsOrQueryBuilderFn : {};
            queryBuilderFn = isFunction(requestOptionsOrQueryBuilderFn) ?
                requestOptionsOrQueryBuilderFn : queryBuilderFn;
            if (typeof uriOrURIs !== "string") {
                return __requestDocuments(this, uriOrURIs, requestOptions, {
                    rootType: queryBuilderFn ? void 0 : QueryPropertyType.FULL,
                    queryBuilderFn,
                });
            }
            const uri = uriOrURIs;
            const target = this.context.registry.hasPointer(uri) ?
                this.context.registry.getPointer(uri, true) :
                void 0;
            if (queryBuilderFn) {
                const types = target ? target.types : [];
                return __getQueryable(this, uri, requestOptions, _ => {
                    types.forEach(type => _.withType(type));
                    return queryBuilderFn.call(void 0, _);
                });
            }
            if (target && target.$isQueried())
                requestOptions.ensureLatest = true;
            return LDPDocumentsRepositoryTrait.PROTOTYPE
                .get.call(this, uri, requestOptions)
                .then(document => {
                if (!document.$_queryableMetadata)
                    return document;
                const resources = document.$getFragments();
                resources.push(document);
                resources.forEach(resource => {
                    resource.$_queryableMetadata = void 0;
                });
                return document;
            });
        },
        resolve(document, requestOptionsOrQueryBuilderFn, queryBuilderFn) {
            return this.get(document.$id, requestOptionsOrQueryBuilderFn, queryBuilderFn);
        },
        refresh(document, requestOptions) {
            if (!document.$isQueried())
                return LDPDocumentsRepositoryTrait.PROTOTYPE
                    .refresh.call(this, document, requestOptions);
            return __refreshQueryable(this, document, requestOptions);
        },
        saveAndRefresh(document, requestOptions) {
            if (!document.$_queryableMetadata)
                return LDPDocumentsRepositoryTrait.PROTOTYPE
                    .saveAndRefresh.call(this, document, requestOptions);
            if (document.$eTag === null)
                return Promise.reject(new IllegalStateError(`The document "${document.$id}" is locally outdated and cannot be saved.`));
            const cloneOptions = RequestUtils.cloneOptions(requestOptions || {});
            return this.save(document, cloneOptions)
                .then(doc => {
                return __refreshQueryable(this, doc, requestOptions);
            });
        },
        getChildren(uri, requestOptionsOrQueryBuilderFn, queryBuilderFn) {
            const requestOptions = typeof requestOptionsOrQueryBuilderFn === "object" ?
                requestOptionsOrQueryBuilderFn : {};
            queryBuilderFn = isFunction(requestOptionsOrQueryBuilderFn) ?
                requestOptionsOrQueryBuilderFn : queryBuilderFn;
            RequestUtils.setRetrievalPreferences({ include: [C.PreferDocumentChecksums] }, requestOptions);
            return __requestRelations(this, uri, requestOptions, {
                rootType: queryBuilderFn ? void 0 : QueryPropertyType.FULL,
                containerPropertyType: QueryContainerPropertyType.CHILD,
                queryBuilderFn,
            });
        },
        getMembers(uri, requestOptionsOrQueryBuilderFn, queryBuilderFn) {
            const requestOptions = typeof requestOptionsOrQueryBuilderFn === "object" ?
                requestOptionsOrQueryBuilderFn : {};
            queryBuilderFn = isFunction(requestOptionsOrQueryBuilderFn) ?
                requestOptionsOrQueryBuilderFn : queryBuilderFn;
            RequestUtils.setRetrievalPreferences({ include: [C.PreferDocumentChecksums] }, requestOptions);
            return __requestRelations(this, uri, requestOptions, {
                rootType: queryBuilderFn ? void 0 : QueryPropertyType.FULL,
                containerPropertyType: QueryContainerPropertyType.MEMBER,
                queryBuilderFn,
            });
        },
        listChildren(uri, requestOptions = {}) {
            return __requestRelations(this, uri, requestOptions, {
                containerPropertyType: QueryContainerPropertyType.CHILD,
                rootType: QueryPropertyType.EMPTY,
            });
        },
        listMembers(uri, requestOptions = {}) {
            return __requestRelations(this, uri, requestOptions, {
                rootType: QueryPropertyType.EMPTY,
                containerPropertyType: QueryContainerPropertyType.MEMBER,
            });
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(QueryableDocumentsRepositoryTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (QueryableDocumentsRepositoryTrait.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, LDPDocumentsRepositoryTrait);
        return ModelDecorator
            .definePropertiesFrom(QueryableDocumentsRepositoryTrait.PROTOTYPE, target);
    },
};

class AskToken extends SharedQueryClauseToken {
    constructor() {
        super();
        this.token = "ask";
        this.datasets = [];
    }
    toString(spaces) {
        let query = "ASK";
        const separator = getSeparator(spaces);
        if (this.datasets.length)
            query += separator + this.datasets.join(separator);
        query += separator + this.where.toString(spaces);
        if (this.modifiers.length)
            query += separator + this.modifiers.join(separator);
        return query;
    }
}

function _getPatterns(iriResolver, patternFunction) {
    const patternOrPatterns = patternFunction(PatternBuilder.create(iriResolver));
    const patterns = Array.isArray(patternOrPatterns) ? patternOrPatterns : [patternOrPatterns];
    return patterns.map(x => x.getPattern());
}
function getWhereFn$1(genericFactory, container) {
    return (patternFunction) => {
        const iriResolver = new IRIResolver(container.iriResolver);
        const patterns = _getPatterns(iriResolver, patternFunction);
        const query = cloneElement(container.targetToken.queryClause, { where: new WhereToken() })
            .addPattern(...patterns);
        const queryToken = cloneElement(container.targetToken, { queryClause: query });
        const newContainer = cloneElement(container, { iriResolver, targetToken: queryToken });
        const groupClause = GroupClause.createFrom(genericFactory, newContainer, {});
        return genericFactory(newContainer, groupClause);
    };
}
const WhereClause = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            where: getWhereFn$1(genericFactory, container),
        });
    },
};

function getFromFn(genericFactory, container, named) {
    return (iri) => {
        const iriResolver = new IRIResolver(container.iriResolver);
        const datasets = container.targetToken.queryClause.datasets
            .concat(new FromToken(iriResolver.resolve(iri), named));
        const queryClause = cloneElement(container.targetToken.queryClause, { datasets });
        const queryToken = cloneElement(container.targetToken, { queryClause });
        const newContainer = cloneElement(container, {
            iriResolver,
            targetToken: queryToken,
        });
        return FromClause.createFrom(genericFactory, newContainer, {});
    };
}
const FromClause = {
    createFrom(genericFactory, container, object) {
        return WhereClause.createFrom(genericFactory, container, Object.assign(object, {
            from: getFromFn(genericFactory, container),
            fromNamed: getFromFn(genericFactory, container, true),
        }));
    },
};

function getSelectFn$1(genericFactory, container) {
    return () => {
        const queryClause = new AskToken();
        const queryToken = cloneElement(container.targetToken, { queryClause });
        const newContainer = new Container({
            iriResolver: container.iriResolver,
            targetToken: queryToken,
        });
        return FromClause.createFrom(genericFactory, newContainer, {});
    };
}
const AskClause = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            ask: getSelectFn$1(genericFactory, container),
        });
    },
};

function getSelectFn$2(genericFactory, container, modifier) {
    return (...variables) => {
        const queryClause = new SelectToken(modifier);
        if (variables.length)
            queryClause.addVariable(...variables.map(x => new VariableToken(x)));
        const queryToken = cloneElement(container.targetToken, { queryClause });
        const newContainer = new Container({
            iriResolver: container.iriResolver,
            targetToken: queryToken,
        });
        return FromClause.createFrom(genericFactory, newContainer, {});
    };
}
const SelectClause = {
    createFrom(genericFactory, container, object) {
        return Object.assign(object, {
            select: getSelectFn$2(genericFactory, container),
            selectDistinct: getSelectFn$2(genericFactory, container, "DISTINCT"),
            selectReduced: getSelectFn$2(genericFactory, container, "REDUCED"),
            selectAll: () => getSelectFn$2(genericFactory, container)(),
            selectAllDistinct: () => getSelectFn$2(genericFactory, container, "DISTINCT")(),
            selectAllReduced: () => getSelectFn$2(genericFactory, container, "REDUCED")(),
        });
    },
};

function base$1(iri) {
    const token = new BaseToken(new IRIRefToken(iri));
    const prologues = this.targetToken
        .prologues.concat(token);
    const queryToken = cloneElement(this.targetToken, { prologues });
    const container = cloneElement(this, { targetToken: queryToken });
    return QueryClause.createFrom(container, {});
}
function vocab(iri) {
    const iriResolver = new IRIResolver(this.iriResolver, iri);
    const container = cloneElement(this, { iriResolver });
    return QueryClause.createFrom(container, {});
}
function prefix(name, iri) {
    const iriResolver = new IRIResolver(this.iriResolver);
    const prologues = this.targetToken.prologues.slice();
    if (iriResolver.prefixes.has(name)) {
        const index = prologues
            .findIndex(token => token.token === "prefix" && token.namespace === name);
        if (index !== -1)
            prologues.splice(index, 1);
    }
    prologues.push(new PrefixToken(name, new IRIRefToken(iri)));
    iriResolver.prefixes.set(name, false);
    const queryToken = cloneElement(this.targetToken, { prologues });
    const container = cloneElement(this, {
        iriResolver,
        targetToken: queryToken,
    });
    return QueryClause.createFrom(container, {});
}
const QueryClause = {
    createFrom(container, object) {
        const selectFactory = SelectClause
            .createFrom.bind(null, container.selectFinishClauseFactory);
        const askFactory = AskClause
            .createFrom.bind(null, container.askFinishClauseFactory);
        return Factory.createFrom(selectFactory, askFactory)(container, Object.assign(object, {
            base: base$1.bind(container),
            vocab: vocab.bind(container),
            prefix: prefix.bind(container),
        }));
    },
};

class SPARQLER {
    constructor(finishSelectFactory = FinishClause.createFrom, finishAskFactory = FinishClause.createFrom) {
        const container = new QueryUnitContainer({
            iriResolver: new IRIResolver(),
            targetToken: new QueryToken(void 0),
            selectFinishClauseFactory: finishSelectFactory,
            askFinishClauseFactory: finishAskFactory,
        });
        return QueryClause.createFrom(container, this);
    }
}

function getFinishSelectFactory(resource, entryPoint) {
    return (container, object) => {
        const finishClause = FinishClause.createFrom(container, object);
        return Object.assign(finishClause, {
            execute: () => resource.executeSELECTQuery(entryPoint, finishClause.toCompactString()),
        });
    };
}
function getFinishAskFactory(resource, entryPoint) {
    return (container, object) => {
        const finishClause = FinishClause.createFrom(container, object);
        return Object.assign(finishClause, {
            execute: () => resource.executeASKQuery(entryPoint, finishClause.toCompactString()),
        });
    };
}
class SPARQLBuilder extends SPARQLER {
    constructor(repository, entryPoint) {
        const finishSelectFactory = getFinishSelectFactory(repository, entryPoint);
        const finishAskFactory = getFinishAskFactory(repository, entryPoint);
        super(finishSelectFactory, finishAskFactory);
    }
}

const SPARQLDocumentsRepositoryTrait = {
    PROTOTYPE: {
        executeASKQuery(uri, askQuery, requestOptions) {
            if (!this.context.registry.inScope(uri, true))
                return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            requestOptions = requestOptions ? requestOptions : {};
            RequestUtils.setAcceptHeader("application/ld+json; q=0.9", requestOptions);
            return SPARQLService
                .executeASKQuery(url, askQuery, requestOptions)
                .then(([rawResults]) => rawResults)
                .catch(_getErrorResponseParserFn(this.context.registry));
        },
        executeSELECTQuery(uri, selectQuery, requestOptions) {
            if (!this.context.registry.inScope(uri, true))
                return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            requestOptions = requestOptions ? requestOptions : {};
            RequestUtils.setAcceptHeader("application/ld+json; q=0.9", requestOptions);
            return SPARQLService
                .executeSELECTQuery(url, selectQuery, this.context.registry, requestOptions)
                .then(([selectResults]) => selectResults)
                .catch(_getErrorResponseParserFn(this.context.registry));
        },
        executeUPDATE(uri, update, requestOptions) {
            if (!this.context.registry.inScope(uri, true))
                return Promise.reject(new IllegalArgumentError(`"${uri}" is out of scope.`));
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            return SPARQLService
                .executeUPDATE(url, update, requestOptions)
                .then(() => { })
                .catch(_getErrorResponseParserFn(this.context.registry));
        },
        sparql(uri) {
            if (!this.context.registry.inScope(uri, true))
                throw new IllegalArgumentError(`"${uri}" is out of scope.`);
            const url = this.context.getObjectSchema().resolveURI(uri, { base: true });
            const schema = this.context.registry.getGeneralSchema();
            let builder = new SPARQLBuilder(this, url)
                .base(schema.base)
                .vocab(schema.vocab);
            schema.prefixes.forEach((name, prefix) => {
                builder = builder.prefix(prefix, name);
            });
            return builder;
        },
    },
    isDecorated(object) {
        return ModelDecorator
            .hasPropertiesFrom(SPARQLDocumentsRepositoryTrait.PROTOTYPE, object);
    },
    decorate(object) {
        if (SPARQLDocumentsRepositoryTrait.isDecorated(object))
            return object;
        const target = ModelDecorator
            .decorateMultiple(object, GeneralRepository);
        return ModelDecorator
            .definePropertiesFrom(SPARQLDocumentsRepositoryTrait.PROTOTYPE, target);
    },
};

const DocumentsRepository = {
    create(data) {
        return DocumentsRepository.createFrom(Object.assign({}, data));
    },
    createFrom(object) {
        return ModelDecorator
            .decorateMultiple(object, QueryableDocumentsRepositoryTrait, SPARQLDocumentsRepositoryTrait, EventEmitterDocumentsRepositoryTrait);
    },
    is(value) {
        return isObject(value)
            && QueryableDocumentsRepositoryTrait.isDecorated(value)
            && SPARQLDocumentsRepositoryTrait.isDecorated(value)
            && EventEmitterDocumentsRepositoryTrait.isDecorated(value);
    },
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

const crypto = {};

'use strict';

/* global crypto:true */


// This string has length 32, a power of 2, so the modulus doesn't introduce a
// bias.
var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
var random = {
  string: function(length) {
    var max = _randomStringChars.length;
    var bytes = crypto.randomBytes(length);
    var ret = [];
    for (var i = 0; i < length; i++) {
      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
    }
    return ret.join('');
  }

, number: function(max) {
    return Math.floor(Math.random() * max);
  }

, numberString: function(max) {
    var t = ('' + (max - 1)).length;
    var p = new Array(t + 1).join('0');
    return (p + this.number(max)).slice(-t);
  }
};
var random_1 = random.string;
var random_2 = random.number;
var random_3 = random.numberString;

var event = createCommonjsModule(function (module) {
'use strict';



var onUnload = {}
  , afterUnload = false
    // detect google chrome packaged apps because they don't allow the 'unload' event
  , isChromePackagedApp = commonjsGlobal.chrome && commonjsGlobal.chrome.app && commonjsGlobal.chrome.app.runtime
  ;

module.exports = {
  attachEvent: function(event, listener) {
    if (typeof commonjsGlobal.addEventListener !== 'undefined') {
      commonjsGlobal.addEventListener(event, listener, false);
    } else if (commonjsGlobal.document && commonjsGlobal.attachEvent) {
      // IE quirks.
      // According to: http://stevesouders.com/misc/test-postmessage.php
      // the message gets delivered only to 'document', not 'window'.
      commonjsGlobal.document.attachEvent('on' + event, listener);
      // I get 'window' for ie8.
      commonjsGlobal.attachEvent('on' + event, listener);
    }
  }

, detachEvent: function(event, listener) {
    if (typeof commonjsGlobal.addEventListener !== 'undefined') {
      commonjsGlobal.removeEventListener(event, listener, false);
    } else if (commonjsGlobal.document && commonjsGlobal.detachEvent) {
      commonjsGlobal.document.detachEvent('on' + event, listener);
      commonjsGlobal.detachEvent('on' + event, listener);
    }
  }

, unloadAdd: function(listener) {
    if (isChromePackagedApp) {
      return null;
    }

    var ref = random.string(8);
    onUnload[ref] = listener;
    if (afterUnload) {
      setTimeout(this.triggerUnloadCallbacks, 0);
    }
    return ref;
  }

, unloadDel: function(ref) {
    if (ref in onUnload) {
      delete onUnload[ref];
    }
  }

, triggerUnloadCallbacks: function() {
    for (var ref in onUnload) {
      onUnload[ref]();
      delete onUnload[ref];
    }
  }
};

var unloadTriggered = function() {
  if (afterUnload) {
    return;
  }
  afterUnload = true;
  module.exports.triggerUnloadCallbacks();
};

// 'unload' alone is not reliable in opera within an iframe, but we
// can't use `beforeunload` as IE fires it on javascript: links.
if (!isChromePackagedApp) {
  module.exports.attachEvent('unload', unloadTriggered);
}
});
var event_1 = event.attachEvent;
var event_2 = event.detachEvent;
var event_3 = event.unloadAdd;
var event_4 = event.unloadDel;
var event_5 = event.triggerUnloadCallbacks;

'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
var requiresPort = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode$1(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode$1(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode$1(part[1])
      , value = decode$1(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encodeURIComponent(key);
      value = encodeURIComponent(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
var stringify$1 = querystringify;
var parse$2 = querystring;

var querystringify_1 = {
	stringify: stringify$1,
	parse: parse$2
};

'use strict';

var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof commonjsGlobal !== 'undefined') globalVar = commonjsGlobal;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url$1(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url$1(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url$1(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url$1)) {
    return new Url$1(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = querystringify_1.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!requiresPort(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || querystringify_1.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!requiresPort(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString$1(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = querystringify_1.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url$1.prototype = { set: set, toString: toString$1 };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url$1.extractProtocol = extractProtocol;
Url$1.location = lolcation;
Url$1.trimLeft = trimLeft;
Url$1.qs = querystringify_1;

var urlParse$1 = Url$1;

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse$3(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse$3(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

"use strict";

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = ms;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

var common = setup;

var browser$2 = createCommonjsModule(function (module, exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof browser$1 !== 'undefined' && 'env' in browser$1) {
    r = browser$1.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = common(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
});
var browser_1 = browser$2.log;
var browser_2 = browser$2.formatArgs;
var browser_3 = browser$2.save;
var browser_4 = browser$2.load;
var browser_5 = browser$2.useColors;
var browser_6 = browser$2.storage;
var browser_7 = browser$2.colors;

'use strict';



var debug$1 = function() {};
if ("development" !== 'production') {
  debug$1 = browser$2('sockjs-client:utils:url');
}

var url = {
  getOrigin: function(url) {
    if (!url) {
      return null;
    }

    var p = new urlParse$1(url);
    if (p.protocol === 'file:') {
      return null;
    }

    var port = p.port;
    if (!port) {
      port = (p.protocol === 'https:') ? '443' : '80';
    }

    return p.protocol + '//' + p.hostname + ':' + port;
  }

, isOriginEqual: function(a, b) {
    var res = this.getOrigin(a) === this.getOrigin(b);
    debug$1('same', a, b, res);
    return res;
  }

, isSchemeEqual: function(a, b) {
    return (a.split(':')[0] === b.split(':')[0]);
  }

, addPath: function (url, path) {
    var qs = url.split('?');
    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
  }

, addQuery: function (url, q) {
    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
  }
};
var url_1 = url.getOrigin;
var url_2 = url.isOriginEqual;
var url_3 = url.isSchemeEqual;
var url_4 = url.addPath;
var url_5 = url.addQuery;

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
});

var websocket = createCommonjsModule(function (module) {
'use strict';

var Driver = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
if (Driver) {
	module.exports = function WebSocketBrowserDriver(url) {
		return new Driver(url);
	};
} else {
	module.exports = undefined;
}
});

'use strict';

var EventEmitter$1 = EventEmitter.EventEmitter
  ;

var debug$2 = function() {};
if ("development" !== 'production') {
  debug$2 = browser$2('sockjs-client:websocket');
}

function WebSocketTransport(transUrl, ignore, options) {
  if (!WebSocketTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  EventEmitter$1.call(this);
  debug$2('constructor', transUrl);

  var self = this;
  var url$1 = url.addPath(transUrl, '/websocket');
  if (url$1.slice(0, 5) === 'https') {
    url$1 = 'wss' + url$1.slice(5);
  } else {
    url$1 = 'ws' + url$1.slice(4);
  }
  this.url = url$1;

  this.ws = new websocket(this.url, [], options);
  this.ws.onmessage = function(e) {
    debug$2('message event', e.data);
    self.emit('message', e.data);
  };
  // Firefox has an interesting bug. If a websocket connection is
  // created after onunload, it stays alive even when user
  // navigates away from the page. In such situation let's lie -
  // let's not open the ws connection at all. See:
  // https://github.com/sockjs/sockjs-client/issues/28
  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
  this.unloadRef = event.unloadAdd(function() {
    debug$2('unload');
    self.ws.close();
  });
  this.ws.onclose = function(e) {
    debug$2('close event', e.code, e.reason);
    self.emit('close', e.code, e.reason);
    self._cleanup();
  };
  this.ws.onerror = function(e) {
    debug$2('error event', e);
    self.emit('close', 1006, 'WebSocket connection broken');
    self._cleanup();
  };
}

inherits_browser(WebSocketTransport, EventEmitter$1);

WebSocketTransport.prototype.send = function(data) {
  var msg = '[' + data + ']';
  debug$2('send', msg);
  this.ws.send(msg);
};

WebSocketTransport.prototype.close = function() {
  debug$2('close');
  var ws = this.ws;
  this._cleanup();
  if (ws) {
    ws.close();
  }
};

WebSocketTransport.prototype._cleanup = function() {
  debug$2('_cleanup');
  var ws = this.ws;
  if (ws) {
    ws.onmessage = ws.onclose = ws.onerror = null;
  }
  event.unloadDel(this.unloadRef);
  this.unloadRef = this.ws = null;
  this.removeAllListeners();
};

WebSocketTransport.enabled = function() {
  debug$2('enabled');
  return !!websocket;
};
WebSocketTransport.transportName = 'websocket';

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;

var websocket$1 = WebSocketTransport;

'use strict';

var EventEmitter$2 = EventEmitter.EventEmitter
  ;

var debug$3 = function() {};
if ("development" !== 'production') {
  debug$3 = browser$2('sockjs-client:buffered-sender');
}

function BufferedSender(url, sender) {
  debug$3(url);
  EventEmitter$2.call(this);
  this.sendBuffer = [];
  this.sender = sender;
  this.url = url;
}

inherits_browser(BufferedSender, EventEmitter$2);

BufferedSender.prototype.send = function(message) {
  debug$3('send', message);
  this.sendBuffer.push(message);
  if (!this.sendStop) {
    this.sendSchedule();
  }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.sendScheduleWait = function() {
  debug$3('sendScheduleWait');
  var self = this;
  var tref;
  this.sendStop = function() {
    debug$3('sendStop');
    self.sendStop = null;
    clearTimeout(tref);
  };
  tref = setTimeout(function() {
    debug$3('timeout');
    self.sendStop = null;
    self.sendSchedule();
  }, 25);
};

BufferedSender.prototype.sendSchedule = function() {
  debug$3('sendSchedule', this.sendBuffer.length);
  var self = this;
  if (this.sendBuffer.length > 0) {
    var payload = '[' + this.sendBuffer.join(',') + ']';
    this.sendStop = this.sender(this.url, payload, function(err) {
      self.sendStop = null;
      if (err) {
        debug$3('error', err);
        self.emit('close', err.code || 1006, 'Sending error: ' + err);
        self.close();
      } else {
        self.sendScheduleWait();
      }
    });
    this.sendBuffer = [];
  }
};

BufferedSender.prototype._cleanup = function() {
  debug$3('_cleanup');
  this.removeAllListeners();
};

BufferedSender.prototype.close = function() {
  debug$3('close');
  this._cleanup();
  if (this.sendStop) {
    this.sendStop();
    this.sendStop = null;
  }
};

var bufferedSender = BufferedSender;

'use strict';

var EventEmitter$3 = EventEmitter.EventEmitter
  ;

var debug$4 = function() {};
if ("development" !== 'production') {
  debug$4 = browser$2('sockjs-client:polling');
}

function Polling(Receiver, receiveUrl, AjaxObject) {
  debug$4(receiveUrl);
  EventEmitter$3.call(this);
  this.Receiver = Receiver;
  this.receiveUrl = receiveUrl;
  this.AjaxObject = AjaxObject;
  this._scheduleReceiver();
}

inherits_browser(Polling, EventEmitter$3);

Polling.prototype._scheduleReceiver = function() {
  debug$4('_scheduleReceiver');
  var self = this;
  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

  poll.on('message', function(msg) {
    debug$4('message', msg);
    self.emit('message', msg);
  });

  poll.once('close', function(code, reason) {
    debug$4('close', code, reason, self.pollIsClosing);
    self.poll = poll = null;

    if (!self.pollIsClosing) {
      if (reason === 'network') {
        self._scheduleReceiver();
      } else {
        self.emit('close', code || 1006, reason);
        self.removeAllListeners();
      }
    }
  });
};

Polling.prototype.abort = function() {
  debug$4('abort');
  this.removeAllListeners();
  this.pollIsClosing = true;
  if (this.poll) {
    this.poll.abort();
  }
};

var polling = Polling;

'use strict';



var debug$5 = function() {};
if ("development" !== 'production') {
  debug$5 = browser$2('sockjs-client:sender-receiver');
}

function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
  var pollUrl = url.addPath(transUrl, urlSuffix);
  debug$5(pollUrl);
  var self = this;
  bufferedSender.call(this, transUrl, senderFunc);

  this.poll = new polling(Receiver, pollUrl, AjaxObject);
  this.poll.on('message', function(msg) {
    debug$5('poll message', msg);
    self.emit('message', msg);
  });
  this.poll.once('close', function(code, reason) {
    debug$5('poll close', code, reason);
    self.poll = null;
    self.emit('close', code, reason);
    self.close();
  });
}

inherits_browser(SenderReceiver, bufferedSender);

SenderReceiver.prototype.close = function() {
  bufferedSender.prototype.close.call(this);
  debug$5('close');
  this.removeAllListeners();
  if (this.poll) {
    this.poll.abort();
    this.poll = null;
  }
};

var senderReceiver = SenderReceiver;

'use strict';



var debug$6 = function() {};
if ("development" !== 'production') {
  debug$6 = browser$2('sockjs-client:ajax-based');
}

function createAjaxSender(AjaxObject) {
  return function(url$1, payload, callback) {
    debug$6('create ajax sender', url$1, payload);
    var opt = {};
    if (typeof payload === 'string') {
      opt.headers = {'Content-type': 'text/plain'};
    }
    var ajaxUrl = url.addPath(url$1, '/xhr_send');
    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
    xo.once('finish', function(status) {
      debug$6('finish', status);
      xo = null;

      if (status !== 200 && status !== 204) {
        return callback(new Error('http status ' + status));
      }
      callback();
    });
    return function() {
      debug$6('abort');
      xo.close();
      xo = null;

      var err = new Error('Aborted');
      err.code = 1000;
      callback(err);
    };
  };
}

function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
  senderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
}

inherits_browser(AjaxBasedTransport, senderReceiver);

var ajaxBased = AjaxBasedTransport;

'use strict';

var EventEmitter$4 = EventEmitter.EventEmitter
  ;

var debug$7 = function() {};
if ("development" !== 'production') {
  debug$7 = browser$2('sockjs-client:receiver:xhr');
}

function XhrReceiver(url, AjaxObject) {
  debug$7(url);
  EventEmitter$4.call(this);
  var self = this;

  this.bufferPosition = 0;

  this.xo = new AjaxObject('POST', url, null);
  this.xo.on('chunk', this._chunkHandler.bind(this));
  this.xo.once('finish', function(status, text) {
    debug$7('finish', status, text);
    self._chunkHandler(status, text);
    self.xo = null;
    var reason = status === 200 ? 'network' : 'permanent';
    debug$7('close', reason);
    self.emit('close', null, reason);
    self._cleanup();
  });
}

inherits_browser(XhrReceiver, EventEmitter$4);

XhrReceiver.prototype._chunkHandler = function(status, text) {
  debug$7('_chunkHandler', status);
  if (status !== 200 || !text) {
    return;
  }

  for (var idx = -1; ; this.bufferPosition += idx + 1) {
    var buf = text.slice(this.bufferPosition);
    idx = buf.indexOf('\n');
    if (idx === -1) {
      break;
    }
    var msg = buf.slice(0, idx);
    if (msg) {
      debug$7('message', msg);
      this.emit('message', msg);
    }
  }
};

XhrReceiver.prototype._cleanup = function() {
  debug$7('_cleanup');
  this.removeAllListeners();
};

XhrReceiver.prototype.abort = function() {
  debug$7('abort');
  if (this.xo) {
    this.xo.close();
    debug$7('close');
    this.emit('close', null, 'user');
    this.xo = null;
  }
  this._cleanup();
};

var xhr$1 = XhrReceiver;

'use strict';

var EventEmitter$5 = EventEmitter.EventEmitter
  , XHR = commonjsGlobal.XMLHttpRequest
  ;

var debug$8 = function() {};
if ("development" !== 'production') {
  debug$8 = browser$2('sockjs-client:browser:xhr');
}

function AbstractXHRObject(method, url, payload, opts) {
  debug$8(method, url);
  var self = this;
  EventEmitter$5.call(this);

  setTimeout(function () {
    self._start(method, url, payload, opts);
  }, 0);
}

inherits_browser(AbstractXHRObject, EventEmitter$5);

AbstractXHRObject.prototype._start = function(method, url$1, payload, opts) {
  var self = this;

  try {
    this.xhr = new XHR();
  } catch (x) {
    // intentionally empty
  }

  if (!this.xhr) {
    debug$8('no xhr');
    this.emit('finish', 0, 'no xhr support');
    this._cleanup();
    return;
  }

  // several browsers cache POSTs
  url$1 = url.addQuery(url$1, 't=' + (+new Date()));

  // Explorer tends to keep connection open, even after the
  // tab gets closed: http://bugs.jquery.com/ticket/5280
  this.unloadRef = event.unloadAdd(function() {
    debug$8('unload cleanup');
    self._cleanup(true);
  });
  try {
    this.xhr.open(method, url$1, true);
    if (this.timeout && 'timeout' in this.xhr) {
      this.xhr.timeout = this.timeout;
      this.xhr.ontimeout = function() {
        debug$8('xhr timeout');
        self.emit('finish', 0, '');
        self._cleanup(false);
      };
    }
  } catch (e) {
    debug$8('exception', e);
    // IE raises an exception on wrong port.
    this.emit('finish', 0, '');
    this._cleanup(false);
    return;
  }

  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
    debug$8('withCredentials');
    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
    // "This never affects same-site requests."

    this.xhr.withCredentials = true;
  }
  if (opts && opts.headers) {
    for (var key in opts.headers) {
      this.xhr.setRequestHeader(key, opts.headers[key]);
    }
  }

  this.xhr.onreadystatechange = function() {
    if (self.xhr) {
      var x = self.xhr;
      var text, status;
      debug$8('readyState', x.readyState);
      switch (x.readyState) {
      case 3:
        // IE doesn't like peeking into responseText or status
        // on Microsoft.XMLHTTP and readystate=3
        try {
          status = x.status;
          text = x.responseText;
        } catch (e) {
          // intentionally empty
        }
        debug$8('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }

        // IE does return readystate == 3 for 404 answers.
        if (status === 200 && text && text.length > 0) {
          debug$8('chunk');
          self.emit('chunk', status, text);
        }
        break;
      case 4:
        status = x.status;
        debug$8('status', status);
        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
        if (status === 1223) {
          status = 204;
        }
        // IE returns this for a bad port
        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
        if (status === 12005 || status === 12029) {
          status = 0;
        }

        debug$8('finish', status, x.responseText);
        self.emit('finish', status, x.responseText);
        self._cleanup(false);
        break;
      }
    }
  };

  try {
    self.xhr.send(payload);
  } catch (e) {
    self.emit('finish', 0, '');
    self._cleanup(false);
  }
};

AbstractXHRObject.prototype._cleanup = function(abort) {
  debug$8('cleanup');
  if (!this.xhr) {
    return;
  }
  this.removeAllListeners();
  event.unloadDel(this.unloadRef);

  // IE needs this field to be a function
  this.xhr.onreadystatechange = function() {};
  if (this.xhr.ontimeout) {
    this.xhr.ontimeout = null;
  }

  if (abort) {
    try {
      this.xhr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
  debug$8('close');
  this._cleanup(true);
};

AbstractXHRObject.enabled = !!XHR;
// override XMLHttpRequest for IE6/7
// obfuscate to avoid firewalls
var axo = ['Active'].concat('Object').join('X');
if (!AbstractXHRObject.enabled && (axo in commonjsGlobal)) {
  debug$8('overriding xmlhttprequest');
  XHR = function() {
    try {
      return new commonjsGlobal[axo]('Microsoft.XMLHTTP');
    } catch (e) {
      return null;
    }
  };
  AbstractXHRObject.enabled = !!new XHR();
}

var cors = false;
try {
  cors = 'withCredentials' in new XHR();
} catch (ignored) {
  // intentionally empty
}

AbstractXHRObject.supportsCORS = cors;

var abstractXhr = AbstractXHRObject;

'use strict';



function XHRCorsObject(method, url, payload, opts) {
  abstractXhr.call(this, method, url, payload, opts);
}

inherits_browser(XHRCorsObject, abstractXhr);

XHRCorsObject.enabled = abstractXhr.enabled && abstractXhr.supportsCORS;

var xhrCors = XHRCorsObject;

'use strict';



function XHRLocalObject(method, url, payload /*, opts */) {
  abstractXhr.call(this, method, url, payload, {
    noCredentials: true
  });
}

inherits_browser(XHRLocalObject, abstractXhr);

XHRLocalObject.enabled = abstractXhr.enabled;

var xhrLocal = XHRLocalObject;

'use strict';

var browser$3 = {
  isOpera: function() {
    return commonjsGlobal.navigator &&
      /opera/i.test(commonjsGlobal.navigator.userAgent);
  }

, isKonqueror: function() {
    return commonjsGlobal.navigator &&
      /konqueror/i.test(commonjsGlobal.navigator.userAgent);
  }

  // #187 wrap document.domain in try/catch because of WP8 from file:///
, hasDomain: function () {
    // non-browser client always has a domain
    if (!commonjsGlobal.document) {
      return true;
    }

    try {
      return !!commonjsGlobal.document.domain;
    } catch (e) {
      return false;
    }
  }
};
var browser_1$1 = browser$3.isOpera;
var browser_2$1 = browser$3.isKonqueror;
var browser_3$1 = browser$3.hasDomain;

'use strict';



function XhrStreamingTransport(transUrl) {
  if (!xhrLocal.enabled && !xhrCors.enabled) {
    throw new Error('Transport created when disabled');
  }
  ajaxBased.call(this, transUrl, '/xhr_streaming', xhr$1, xhrCors);
}

inherits_browser(XhrStreamingTransport, ajaxBased);

XhrStreamingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }
  // Opera doesn't support xhr-streaming #60
  // But it might be able to #92
  if (browser$3.isOpera()) {
    return false;
  }

  return xhrCors.enabled;
};

XhrStreamingTransport.transportName = 'xhr-streaming';
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
// Only require body when used in a browser
XhrStreamingTransport.needBody = !!commonjsGlobal.document;

var xhrStreaming = XhrStreamingTransport;

'use strict';

var EventEmitter$6 = EventEmitter.EventEmitter
  ;

var debug$9 = function() {};
if ("development" !== 'production') {
  debug$9 = browser$2('sockjs-client:sender:xdr');
}

// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

function XDRObject(method, url, payload) {
  debug$9(method, url);
  var self = this;
  EventEmitter$6.call(this);

  setTimeout(function() {
    self._start(method, url, payload);
  }, 0);
}

inherits_browser(XDRObject, EventEmitter$6);

XDRObject.prototype._start = function(method, url$1, payload) {
  debug$9('_start');
  var self = this;
  var xdr = new commonjsGlobal.XDomainRequest();
  // IE caches even POSTs
  url$1 = url.addQuery(url$1, 't=' + (+new Date()));

  xdr.onerror = function() {
    debug$9('onerror');
    self._error();
  };
  xdr.ontimeout = function() {
    debug$9('ontimeout');
    self._error();
  };
  xdr.onprogress = function() {
    debug$9('progress', xdr.responseText);
    self.emit('chunk', 200, xdr.responseText);
  };
  xdr.onload = function() {
    debug$9('load');
    self.emit('finish', 200, xdr.responseText);
    self._cleanup(false);
  };
  this.xdr = xdr;
  this.unloadRef = event.unloadAdd(function() {
    self._cleanup(true);
  });
  try {
    // Fails with AccessDenied if port number is bogus
    this.xdr.open(method, url$1);
    if (this.timeout) {
      this.xdr.timeout = this.timeout;
    }
    this.xdr.send(payload);
  } catch (x) {
    this._error();
  }
};

XDRObject.prototype._error = function() {
  this.emit('finish', 0, '');
  this._cleanup(false);
};

XDRObject.prototype._cleanup = function(abort) {
  debug$9('cleanup', abort);
  if (!this.xdr) {
    return;
  }
  this.removeAllListeners();
  event.unloadDel(this.unloadRef);

  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
  if (abort) {
    try {
      this.xdr.abort();
    } catch (x) {
      // intentionally empty
    }
  }
  this.unloadRef = this.xdr = null;
};

XDRObject.prototype.close = function() {
  debug$9('close');
  this._cleanup(true);
};

// IE 8/9 if the request target uses the same scheme - #79
XDRObject.enabled = !!(commonjsGlobal.XDomainRequest && browser$3.hasDomain());

var xdr = XDRObject;

'use strict';



// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

function XdrStreamingTransport(transUrl) {
  if (!xdr.enabled) {
    throw new Error('Transport created when disabled');
  }
  ajaxBased.call(this, transUrl, '/xhr_streaming', xhr$1, xdr);
}

inherits_browser(XdrStreamingTransport, ajaxBased);

XdrStreamingTransport.enabled = function(info) {
  if (info.cookie_needed || info.nullOrigin) {
    return false;
  }
  return xdr.enabled && info.sameScheme;
};

XdrStreamingTransport.transportName = 'xdr-streaming';
XdrStreamingTransport.roundTrips = 2; // preflight, ajax

var xdrStreaming = XdrStreamingTransport;

var eventsource = commonjsGlobal.EventSource;

'use strict';

var EventEmitter$7 = EventEmitter.EventEmitter
  ;

var debug$a = function() {};
if ("development" !== 'production') {
  debug$a = browser$2('sockjs-client:receiver:eventsource');
}

function EventSourceReceiver(url) {
  debug$a(url);
  EventEmitter$7.call(this);

  var self = this;
  var es = this.es = new eventsource(url);
  es.onmessage = function(e) {
    debug$a('message', e.data);
    self.emit('message', decodeURI(e.data));
  };
  es.onerror = function(e) {
    debug$a('error', es.readyState, e);
    // ES on reconnection has readyState = 0 or 1.
    // on network error it's CLOSED = 2
    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
    self._cleanup();
    self._close(reason);
  };
}

inherits_browser(EventSourceReceiver, EventEmitter$7);

EventSourceReceiver.prototype.abort = function() {
  debug$a('abort');
  this._cleanup();
  this._close('user');
};

EventSourceReceiver.prototype._cleanup = function() {
  debug$a('cleanup');
  var es = this.es;
  if (es) {
    es.onmessage = es.onerror = null;
    es.close();
    this.es = null;
  }
};

EventSourceReceiver.prototype._close = function(reason) {
  debug$a('close', reason);
  var self = this;
  // Safari and chrome < 15 crash if we close window before
  // waiting for ES cleanup. See:
  // https://code.google.com/p/chromium/issues/detail?id=89155
  setTimeout(function() {
    self.emit('close', null, reason);
    self.removeAllListeners();
  }, 200);
};

var eventsource$1 = EventSourceReceiver;

'use strict';



function EventSourceTransport(transUrl) {
  if (!EventSourceTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }

  ajaxBased.call(this, transUrl, '/eventsource', eventsource$1, xhrCors);
}

inherits_browser(EventSourceTransport, ajaxBased);

EventSourceTransport.enabled = function() {
  return !!eventsource;
};

EventSourceTransport.transportName = 'eventsource';
EventSourceTransport.roundTrips = 2;

var eventsource$2 = EventSourceTransport;

var json3 = createCommonjsModule(function (module, exports) {
/*! JSON v3.3.2 | https://bestiejs.github.io/json3 | Copyright 2012-2015, Kit Cambridge, Benjamin Tan | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof undefined === "function" && undefined.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes['object'] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes['object'] && module && !module.nodeType && typeof commonjsGlobal == "object" && commonjsGlobal;

  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root.Object());
    exports || (exports = root.Object());

    // Native constructor aliases.
    var Number = context.Number || root.Number,
        String = context.String || root.String,
        Object = context.Object || root.Object,
        Date = context.Date || root.Date,
        SyntaxError = context.SyntaxError || root.SyntaxError,
        TypeError = context.TypeError || root.TypeError,
        Math = context.Math || root.Math,
        nativeJSON = context.JSON || root.JSON;

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty = objectProto.hasOwnProperty,
        undefined$1;

    // Internal: Contains `try...catch` logic used by other functions.
    // This prevents other functions from being deoptimized.
    function attempt(func, errorFunc) {
      try {
        func();
      } catch (exception) {
        if (errorFunc) {
          errorFunc();
        }
      }
    }

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    attempt(function () {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    });

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] != null) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("date-serialization") && has("json-parse");
      } else if (name == "date-serialization") {
        // Indicates whether `Date`s can be serialized accurately by `JSON.stringify`.
        isSupported = has("json-stringify") && isExtended;
        if (isSupported) {
          var stringify = exports.stringify;
          attempt(function () {
            isSupported =
              // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
              // serialize extended years.
              stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
              // The milliseconds are optional in ES 5, but required in 5.1.
              stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
              // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
              // four-digit years instead of six-digit years. Credits: @Yaffle.
              stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
              // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
              // values less than 1000. Credits: @Yaffle.
              stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
          });
        }
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function";
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            attempt(function () {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undefined$1 &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undefined$1) === undefined$1 &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undefined$1 &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undefined$1]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undefined$1, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]";
            }, function () {
              stringifySupported = false;
            });
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse, parseSupported;
          if (typeof parse == "function") {
            attempt(function () {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  attempt(function () {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  });
                  if (parseSupported) {
                    attempt(function () {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    });
                  }
                  if (parseSupported) {
                    attempt(function () {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    });
                  }
                }
              }
            }, function () {
              parseSupported = false;
            });
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }
    has["bug-string-char-index"] = has["date-serialization"] = has["json"] = has["json-stringify"] = has["json-parse"] = null;

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      var forOwn = function (object, callback) {
        var size = 0, Properties, dontEnums, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        dontEnums = new Properties();
        for (property in dontEnums) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(dontEnums, property)) {
            size++;
          }
        }
        Properties = dontEnums = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          dontEnums = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = dontEnums.length; property = dontEnums[--length];) {
              if (hasProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forOwn = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forOwn(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify") && !has("date-serialization")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Serializes a date object.
        var serializeDate = function (value) {
          var getData, year, month, date, time, hours, minutes, seconds, milliseconds;
          // Define additional utility methods if the `Date` methods are buggy.
          if (!isExtended) {
            var floor = Math.floor;
            // A mapping between the months of the year and the number of days between
            // January 1st and the first of the respective month.
            var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            // Internal: Calculates the number of days between the Unix epoch and the
            // first day of the given month.
            var getDay = function (year, month) {
              return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
            };
            getData = function (value) {
              // Manually compute the year, month, date, hours, minutes,
              // seconds, and milliseconds if the `getUTC*` methods are
              // buggy. Adapted from @Yaffle's `date-shim` project.
              date = floor(value / 864e5);
              for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
              for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
              date = 1 + date - getDay(year, month);
              // The `time` value specifies the time within the day (see ES
              // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
              // to compute `A modulo B`, as the `%` operator does not
              // correspond to the `modulo` operation for negative numbers.
              time = (value % 864e5 + 864e5) % 864e5;
              // The hours, minutes, seconds, and milliseconds are obtained by
              // decomposing the time within the day. See section 15.9.1.10.
              hours = floor(time / 36e5) % 24;
              minutes = floor(time / 6e4) % 60;
              seconds = floor(time / 1e3) % 60;
              milliseconds = time % 1e3;
            };
          } else {
            getData = function (value) {
              year = value.getUTCFullYear();
              month = value.getUTCMonth();
              date = value.getUTCDate();
              hours = value.getUTCHours();
              minutes = value.getUTCMinutes();
              seconds = value.getUTCSeconds();
              milliseconds = value.getUTCMilliseconds();
            };
          }
          serializeDate = function (value) {
            if (value > -1 / 0 && value < 1 / 0) {
              // Dates are serialized according to the `Date#toJSON` method
              // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
              // for the ISO 8601 date time string format.
              getData(value);
              // Serialize extended years correctly.
              value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
              "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
              // Months, dates, hours, minutes, and seconds should have two
              // digits; milliseconds should have three.
              "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
              // Milliseconds are optional in ES 5.0, but required in 5.1.
              "." + toPaddedString(3, milliseconds) + "Z";
              year = month = date = hours = minutes = seconds = milliseconds = null;
            } else {
              value = null;
            }
            return value;
          };
          return serializeDate(value);
        };

        // For environments with `JSON.stringify` but buggy date serialization,
        // we override the native `Date#toJSON` implementation with a
        // spec-compliant one.
        if (has("json-stringify") && !has("date-serialization")) {
          // Internal: the `Date#toJSON` implementation used to override the native one.
          function dateToJSON (key) {
            return serializeDate(this);
          }

          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
          var nativeStringify = exports.stringify;
          exports.stringify = function (source, filter, width) {
            var nativeToJSON = Date.prototype.toJSON;
            Date.prototype.toJSON = dateToJSON;
            var result = nativeStringify(source, filter, width);
            Date.prototype.toJSON = nativeToJSON;
            return result;
          };
        } else {
          // Internal: Double-quotes a string `value`, replacing all ASCII control
          // characters (characters with code unit values between 0 and 31) with
          // their escaped equivalents. This is an implementation of the
          // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
          var unicodePrefix = "\\u00";
          var escapeChar = function (character) {
            var charCode = character.charCodeAt(0), escaped = Escapes[charCode];
            if (escaped) {
              return escaped;
            }
            return unicodePrefix + toPaddedString(2, charCode.toString(16));
          };
          var reEscape = /[\x00-\x1f\x22\x5c]/g;
          var quote = function (value) {
            reEscape.lastIndex = 0;
            return '"' +
              (
                reEscape.test(value)
                  ? value.replace(reEscape, escapeChar)
                  : value
              ) +
              '"';
          };

          // Internal: Recursively serializes an object. Implements the
          // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
          var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
            var value, type, className, results, element, index, length, prefix, result;
            attempt(function () {
              // Necessary for host object support.
              value = object[property];
            });
            if (typeof value == "object" && value) {
              if (value.getUTCFullYear && getClass.call(value) == dateClass && value.toJSON === Date.prototype.toJSON) {
                value = serializeDate(value);
              } else if (typeof value.toJSON == "function") {
                value = value.toJSON(property);
              }
            }
            if (callback) {
              // If a replacement function was provided, call it to obtain the value
              // for serialization.
              value = callback.call(object, property, value);
            }
            // Exit early if value is `undefined` or `null`.
            if (value == undefined$1) {
              return value === undefined$1 ? value : "null";
            }
            type = typeof value;
            // Only call `getClass` if the value is an object.
            if (type == "object") {
              className = getClass.call(value);
            }
            switch (className || type) {
              case "boolean":
              case booleanClass:
                // Booleans are represented literally.
                return "" + value;
              case "number":
              case numberClass:
                // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                // `"null"`.
                return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
              case "string":
              case stringClass:
                // Strings are double-quoted and escaped.
                return quote("" + value);
            }
            // Recursively serialize objects and arrays.
            if (typeof value == "object") {
              // Check for cyclic structures. This is a linear search; performance
              // is inversely proportional to the number of unique nested objects.
              for (length = stack.length; length--;) {
                if (stack[length] === value) {
                  // Cyclic structures cannot be serialized by `JSON.stringify`.
                  throw TypeError();
                }
              }
              // Add the object to the stack of traversed objects.
              stack.push(value);
              results = [];
              // Save the current indentation level and indent one additional level.
              prefix = indentation;
              indentation += whitespace;
              if (className == arrayClass) {
                // Recursively serialize array elements.
                for (index = 0, length = value.length; index < length; index++) {
                  element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                  results.push(element === undefined$1 ? "null" : element);
                }
                result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
              } else {
                // Recursively serialize object members. Members are selected from
                // either a user-specified list of property names, or the object
                // itself.
                forOwn(properties || value, function (property) {
                  var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                  if (element !== undefined$1) {
                    // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                    // is not the empty string, let `member` {quote(property) + ":"}
                    // be the concatenation of `member` and the `space` character."
                    // The "`space` character" refers to the literal space
                    // character, not the `space` {width} argument provided to
                    // `JSON.stringify`.
                    results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                  }
                });
                result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
              }
              // Remove the object from the traversed object stack.
              stack.pop();
              return result;
            }
          };

          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
          exports.stringify = function (source, filter, width) {
            var whitespace, callback, properties, className;
            if (objectTypes[typeof filter] && filter) {
              className = getClass.call(filter);
              if (className == functionClass) {
                callback = filter;
              } else if (className == arrayClass) {
                // Convert the property names array into a makeshift set.
                properties = {};
                for (var index = 0, length = filter.length, value; index < length;) {
                  value = filter[index++];
                  className = getClass.call(value);
                  if (className == "[object String]" || className == "[object Number]") {
                    properties[value] = 1;
                  }
                }
              }
            }
            if (width) {
              className = getClass.call(width);
              if (className == numberClass) {
                // Convert the `width` to an integer and create a string containing
                // `width` number of space characters.
                if ((width -= width % 1) > 0) {
                  if (width > 10) {
                    width = 10;
                  }
                  for (whitespace = ""; whitespace.length < width;) {
                    whitespace += " ";
                  }
                }
              } else if (className == stringClass) {
                whitespace = width.length <= 10 ? width : width.slice(0, 10);
              }
            }
            // Opera <= 7.54u2 discards the values associated with empty string keys
            // (`""`) only if they are used directly within an object member list
            // (e.g., `!("" in { "": 1})`).
            return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
          };
        }
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length; position++) {
                      charCode = source.charCodeAt(position);
                      if (charCode < 48 || charCode > 57) {
                        break;
                      }
                    }
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length; position++) {
                      charCode = source.charCodeAt(position);
                      if (charCode < 48 || charCode > 57) {
                        break;
                      }
                    }
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                var temp = source.slice(Index, Index + 4);
                if (temp == "true") {
                  Index += 4;
                  return true;
                } else if (temp == "fals" && source.charCodeAt(Index + 4 ) == 101) {
                  Index += 5;
                  return false;
                } else if (temp == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;;) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                } else {
                  hasMembers = true;
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;;) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                } else {
                  hasMembers = true;
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undefined$1) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forOwn` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(getClass, forOwn, value, length, callback);
              }
            } else {
              forOwn(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports.runInContext = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root.JSON3,
        isRestored = false;

    var JSON3 = runInContext(root, (root.JSON3 = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root.JSON3 = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    undefined(function () {
      return JSON3;
    });
  }
}).call(commonjsGlobal);
});

var version$2 = '1.4.0';

var iframe = createCommonjsModule(function (module) {
'use strict';



var debug = function() {};
if ("development" !== 'production') {
  debug = browser$2('sockjs-client:utils:iframe');
}

module.exports = {
  WPrefix: '_jp'
, currentWindowId: null

, polluteGlobalNamespace: function() {
    if (!(module.exports.WPrefix in commonjsGlobal)) {
      commonjsGlobal[module.exports.WPrefix] = {};
    }
  }

, postMessage: function(type, data) {
    if (commonjsGlobal.parent !== commonjsGlobal) {
      commonjsGlobal.parent.postMessage(json3.stringify({
        windowId: module.exports.currentWindowId
      , type: type
      , data: data || ''
      }), '*');
    } else {
      debug('Cannot postMessage, no parent window.', type, data);
    }
  }

, createIframe: function(iframeUrl, errorCallback) {
    var iframe = commonjsGlobal.document.createElement('iframe');
    var tref, unloadRef;
    var unattach = function() {
      debug('unattach');
      clearTimeout(tref);
      // Explorer had problems with that.
      try {
        iframe.onload = null;
      } catch (x) {
        // intentionally empty
      }
      iframe.onerror = null;
    };
    var cleanup = function() {
      debug('cleanup');
      if (iframe) {
        unattach();
        // This timeout makes chrome fire onbeforeunload event
        // within iframe. Without the timeout it goes straight to
        // onunload.
        setTimeout(function() {
          if (iframe) {
            iframe.parentNode.removeChild(iframe);
          }
          iframe = null;
        }, 0);
        event.unloadDel(unloadRef);
      }
    };
    var onerror = function(err) {
      debug('onerror', err);
      if (iframe) {
        cleanup();
        errorCallback(err);
      }
    };
    var post = function(msg, origin) {
      debug('post', msg, origin);
      setTimeout(function() {
        try {
          // When the iframe is not loaded, IE raises an exception
          // on 'contentWindow'.
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(msg, origin);
          }
        } catch (x) {
          // intentionally empty
        }
      }, 0);
    };

    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function() {
      onerror('onerror');
    };
    iframe.onload = function() {
      debug('onload');
      // `onload` is triggered before scripts on the iframe are
      // executed. Give it few seconds to actually load stuff.
      clearTimeout(tref);
      tref = setTimeout(function() {
        onerror('onload timeout');
      }, 2000);
    };
    commonjsGlobal.document.body.appendChild(iframe);
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = event.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }

/* eslint no-undef: "off", new-cap: "off" */
, createHtmlfile: function(iframeUrl, errorCallback) {
    var axo = ['Active'].concat('Object').join('X');
    var doc = new commonjsGlobal[axo]('htmlfile');
    var tref, unloadRef;
    var iframe;
    var unattach = function() {
      clearTimeout(tref);
      iframe.onerror = null;
    };
    var cleanup = function() {
      if (doc) {
        unattach();
        event.unloadDel(unloadRef);
        iframe.parentNode.removeChild(iframe);
        iframe = doc = null;
        CollectGarbage();
      }
    };
    var onerror = function(r) {
      debug('onerror', r);
      if (doc) {
        cleanup();
        errorCallback(r);
      }
    };
    var post = function(msg, origin) {
      try {
        // When the iframe is not loaded, IE raises an exception
        // on 'contentWindow'.
        setTimeout(function() {
          if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(msg, origin);
          }
        }, 0);
      } catch (x) {
        // intentionally empty
      }
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + commonjsGlobal.document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[module.exports.WPrefix] = commonjsGlobal[module.exports.WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframeUrl;
    iframe.onerror = function() {
      onerror('onerror');
    };
    tref = setTimeout(function() {
      onerror('timeout');
    }, 15000);
    unloadRef = event.unloadAdd(cleanup);
    return {
      post: post
    , cleanup: cleanup
    , loaded: unattach
    };
  }
};

module.exports.iframeEnabled = false;
if (commonjsGlobal.document) {
  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
  // huge delay, or not at all.
  module.exports.iframeEnabled = (typeof commonjsGlobal.postMessage === 'function' ||
    typeof commonjsGlobal.postMessage === 'object') && (!browser$3.isKonqueror());
}
});
var iframe_1 = iframe.WPrefix;
var iframe_2 = iframe.currentWindowId;
var iframe_3 = iframe.polluteGlobalNamespace;
var iframe_4 = iframe.postMessage;
var iframe_5 = iframe.createIframe;
var iframe_6 = iframe.createHtmlfile;
var iframe_7 = iframe.iframeEnabled;

'use strict';

// Few cool transports do work only for same-origin. In order to make
// them work cross-domain we shall use iframe, served from the
// remote domain. New browsers have capabilities to communicate with
// cross domain iframe using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var EventEmitter$8 = EventEmitter.EventEmitter
  ;

var debug$b = function() {};
if ("development" !== 'production') {
  debug$b = browser$2('sockjs-client:transport:iframe');
}

function IframeTransport(transport, transUrl, baseUrl) {
  if (!IframeTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  EventEmitter$8.call(this);

  var self = this;
  this.origin = url.getOrigin(baseUrl);
  this.baseUrl = baseUrl;
  this.transUrl = transUrl;
  this.transport = transport;
  this.windowId = random.string(8);

  var iframeUrl = url.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
  debug$b(transport, transUrl, iframeUrl);

  this.iframeObj = iframe.createIframe(iframeUrl, function(r) {
    debug$b('err callback');
    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
    self.close();
  });

  this.onmessageCallback = this._message.bind(this);
  event.attachEvent('message', this.onmessageCallback);
}

inherits_browser(IframeTransport, EventEmitter$8);

IframeTransport.prototype.close = function() {
  debug$b('close');
  this.removeAllListeners();
  if (this.iframeObj) {
    event.detachEvent('message', this.onmessageCallback);
    try {
      // When the iframe is not loaded, IE raises an exception
      // on 'contentWindow'.
      this.postMessage('c');
    } catch (x) {
      // intentionally empty
    }
    this.iframeObj.cleanup();
    this.iframeObj = null;
    this.onmessageCallback = this.iframeObj = null;
  }
};

IframeTransport.prototype._message = function(e) {
  debug$b('message', e.data);
  if (!url.isOriginEqual(e.origin, this.origin)) {
    debug$b('not same origin', e.origin, this.origin);
    return;
  }

  var iframeMessage;
  try {
    iframeMessage = json3.parse(e.data);
  } catch (ignored) {
    debug$b('bad json', e.data);
    return;
  }

  if (iframeMessage.windowId !== this.windowId) {
    debug$b('mismatched window id', iframeMessage.windowId, this.windowId);
    return;
  }

  switch (iframeMessage.type) {
  case 's':
    this.iframeObj.loaded();
    // window global dependency
    this.postMessage('s', json3.stringify([
      version$2
    , this.transport
    , this.transUrl
    , this.baseUrl
    ]));
    break;
  case 't':
    this.emit('message', iframeMessage.data);
    break;
  case 'c':
    var cdata;
    try {
      cdata = json3.parse(iframeMessage.data);
    } catch (ignored) {
      debug$b('bad json', iframeMessage.data);
      return;
    }
    this.emit('close', cdata[0], cdata[1]);
    this.close();
    break;
  }
};

IframeTransport.prototype.postMessage = function(type, data) {
  debug$b('postMessage', type, data);
  this.iframeObj.post(json3.stringify({
    windowId: this.windowId
  , type: type
  , data: data || ''
  }), this.origin);
};

IframeTransport.prototype.send = function(message) {
  debug$b('send', message);
  this.postMessage('m', message);
};

IframeTransport.enabled = function() {
  return iframe.iframeEnabled;
};

IframeTransport.transportName = 'iframe';
IframeTransport.roundTrips = 2;

var iframe$1 = IframeTransport;

'use strict';

var object = {
  isObject: function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

, extend: function(obj) {
    if (!this.isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
};
var object_1 = object.isObject;
var object_2 = object.extend;

'use strict';



var iframeWrap = function(transport) {

  function IframeWrapTransport(transUrl, baseUrl) {
    iframe$1.call(this, transport.transportName, transUrl, baseUrl);
  }

  inherits_browser(IframeWrapTransport, iframe$1);

  IframeWrapTransport.enabled = function(url, info) {
    if (!commonjsGlobal.document) {
      return false;
    }

    var iframeInfo = object.extend({}, info);
    iframeInfo.sameOrigin = true;
    return transport.enabled(iframeInfo) && iframe$1.enabled();
  };

  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
  IframeWrapTransport.needBody = true;
  IframeWrapTransport.roundTrips = iframe$1.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

  IframeWrapTransport.facadeTransport = transport;

  return IframeWrapTransport;
};

'use strict';

var EventEmitter$9 = EventEmitter.EventEmitter
  ;

var debug$c = function() {};
if ("development" !== 'production') {
  debug$c = browser$2('sockjs-client:receiver:htmlfile');
}

function HtmlfileReceiver(url$1) {
  debug$c(url$1);
  EventEmitter$9.call(this);
  var self = this;
  iframe.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  url$1 = url.addQuery(url$1, 'c=' + decodeURIComponent(iframe.WPrefix + '.' + this.id));

  debug$c('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
      iframe.createHtmlfile : iframe.createIframe;

  commonjsGlobal[iframe.WPrefix][this.id] = {
    start: function() {
      debug$c('start');
      self.iframeObj.loaded();
    }
  , message: function(data) {
      debug$c('message', data);
      self.emit('message', data);
    }
  , stop: function() {
      debug$c('stop');
      self._cleanup();
      self._close('network');
    }
  };
  this.iframeObj = constructFunc(url$1, function() {
    debug$c('callback');
    self._cleanup();
    self._close('permanent');
  });
}

inherits_browser(HtmlfileReceiver, EventEmitter$9);

HtmlfileReceiver.prototype.abort = function() {
  debug$c('abort');
  this._cleanup();
  this._close('user');
};

HtmlfileReceiver.prototype._cleanup = function() {
  debug$c('_cleanup');
  if (this.iframeObj) {
    this.iframeObj.cleanup();
    this.iframeObj = null;
  }
  delete commonjsGlobal[iframe.WPrefix][this.id];
};

HtmlfileReceiver.prototype._close = function(reason) {
  debug$c('_close', reason);
  this.emit('close', null, reason);
  this.removeAllListeners();
};

HtmlfileReceiver.htmlfileEnabled = false;

// obfuscate to avoid firewalls
var axo$1 = ['Active'].concat('Object').join('X');
if (axo$1 in commonjsGlobal) {
  try {
    HtmlfileReceiver.htmlfileEnabled = !!new commonjsGlobal[axo$1]('htmlfile');
  } catch (x) {
    // intentionally empty
  }
}

HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframe.iframeEnabled;

var htmlfile = HtmlfileReceiver;

'use strict';



function HtmlFileTransport(transUrl) {
  if (!htmlfile.enabled) {
    throw new Error('Transport created when disabled');
  }
  ajaxBased.call(this, transUrl, '/htmlfile', htmlfile, xhrLocal);
}

inherits_browser(HtmlFileTransport, ajaxBased);

HtmlFileTransport.enabled = function(info) {
  return htmlfile.enabled && info.sameOrigin;
};

HtmlFileTransport.transportName = 'htmlfile';
HtmlFileTransport.roundTrips = 2;

var htmlfile$1 = HtmlFileTransport;

'use strict';



function XhrPollingTransport(transUrl) {
  if (!xhrLocal.enabled && !xhrCors.enabled) {
    throw new Error('Transport created when disabled');
  }
  ajaxBased.call(this, transUrl, '/xhr', xhr$1, xhrCors);
}

inherits_browser(XhrPollingTransport, ajaxBased);

XhrPollingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }

  if (xhrLocal.enabled && info.sameOrigin) {
    return true;
  }
  return xhrCors.enabled;
};

XhrPollingTransport.transportName = 'xhr-polling';
XhrPollingTransport.roundTrips = 2; // preflight, ajax

var xhrPolling = XhrPollingTransport;

'use strict';



function XdrPollingTransport(transUrl) {
  if (!xdr.enabled) {
    throw new Error('Transport created when disabled');
  }
  ajaxBased.call(this, transUrl, '/xhr', xhr$1, xdr);
}

inherits_browser(XdrPollingTransport, ajaxBased);

XdrPollingTransport.enabled = xdrStreaming.enabled;
XdrPollingTransport.transportName = 'xdr-polling';
XdrPollingTransport.roundTrips = 2; // preflight, ajax

var xdrPolling = XdrPollingTransport;

'use strict';

var EventEmitter$a = EventEmitter.EventEmitter
  ;

var debug$d = function() {};
if ("development" !== 'production') {
  debug$d = browser$2('sockjs-client:receiver:jsonp');
}

function JsonpReceiver(url$1) {
  debug$d(url$1);
  var self = this;
  EventEmitter$a.call(this);

  iframe.polluteGlobalNamespace();

  this.id = 'a' + random.string(6);
  var urlWithId = url.addQuery(url$1, 'c=' + encodeURIComponent(iframe.WPrefix + '.' + this.id));

  commonjsGlobal[iframe.WPrefix][this.id] = this._callback.bind(this);
  this._createScript(urlWithId);

  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
  this.timeoutId = setTimeout(function() {
    debug$d('timeout');
    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
  }, JsonpReceiver.timeout);
}

inherits_browser(JsonpReceiver, EventEmitter$a);

JsonpReceiver.prototype.abort = function() {
  debug$d('abort');
  if (commonjsGlobal[iframe.WPrefix][this.id]) {
    var err = new Error('JSONP user aborted read');
    err.code = 1000;
    this._abort(err);
  }
};

JsonpReceiver.timeout = 35000;
JsonpReceiver.scriptErrorTimeout = 1000;

JsonpReceiver.prototype._callback = function(data) {
  debug$d('_callback', data);
  this._cleanup();

  if (this.aborting) {
    return;
  }

  if (data) {
    debug$d('message', data);
    this.emit('message', data);
  }
  this.emit('close', null, 'network');
  this.removeAllListeners();
};

JsonpReceiver.prototype._abort = function(err) {
  debug$d('_abort', err);
  this._cleanup();
  this.aborting = true;
  this.emit('close', err.code, err.message);
  this.removeAllListeners();
};

JsonpReceiver.prototype._cleanup = function() {
  debug$d('_cleanup');
  clearTimeout(this.timeoutId);
  if (this.script2) {
    this.script2.parentNode.removeChild(this.script2);
    this.script2 = null;
  }
  if (this.script) {
    var script = this.script;
    // Unfortunately, you can't really abort script loading of
    // the script.
    script.parentNode.removeChild(script);
    script.onreadystatechange = script.onerror =
        script.onload = script.onclick = null;
    this.script = null;
  }
  delete commonjsGlobal[iframe.WPrefix][this.id];
};

JsonpReceiver.prototype._scriptError = function() {
  debug$d('_scriptError');
  var self = this;
  if (this.errorTimer) {
    return;
  }

  this.errorTimer = setTimeout(function() {
    if (!self.loadedOkay) {
      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
    }
  }, JsonpReceiver.scriptErrorTimeout);
};

JsonpReceiver.prototype._createScript = function(url) {
  debug$d('_createScript', url);
  var self = this;
  var script = this.script = commonjsGlobal.document.createElement('script');
  var script2;  // Opera synchronous load trick.

  script.id = 'a' + random.string(8);
  script.src = url;
  script.type = 'text/javascript';
  script.charset = 'UTF-8';
  script.onerror = this._scriptError.bind(this);
  script.onload = function() {
    debug$d('onload');
    self._abort(new Error('JSONP script loaded abnormally (onload)'));
  };

  // IE9 fires 'error' event after onreadystatechange or before, in random order.
  // Use loadedOkay to determine if actually errored
  script.onreadystatechange = function() {
    debug$d('onreadystatechange', script.readyState);
    if (/loaded|closed/.test(script.readyState)) {
      if (script && script.htmlFor && script.onclick) {
        self.loadedOkay = true;
        try {
          // In IE, actually execute the script.
          script.onclick();
        } catch (x) {
          // intentionally empty
        }
      }
      if (script) {
        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
      }
    }
  };
  // IE: event/htmlFor/onclick trick.
  // One can't rely on proper order for onreadystatechange. In order to
  // make sure, set a 'htmlFor' and 'event' properties, so that
  // script code will be installed as 'onclick' handler for the
  // script object. Later, onreadystatechange, manually execute this
  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
  // set. For reference see:
  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
  // Also, read on that about script ordering:
  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
  if (typeof script.async === 'undefined' && commonjsGlobal.document.attachEvent) {
    // According to mozilla docs, in recent browsers script.async defaults
    // to 'true', so we may use it to detect a good browser:
    // https://developer.mozilla.org/en/HTML/Element/script
    if (!browser$3.isOpera()) {
      // Naively assume we're in IE
      try {
        script.htmlFor = script.id;
        script.event = 'onclick';
      } catch (x) {
        // intentionally empty
      }
      script.async = true;
    } else {
      // Opera, second sync script hack
      script2 = this.script2 = commonjsGlobal.document.createElement('script');
      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
      script.async = script2.async = false;
    }
  }
  if (typeof script.async !== 'undefined') {
    script.async = true;
  }

  var head = commonjsGlobal.document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
  if (script2) {
    head.insertBefore(script2, head.firstChild);
  }
};

var jsonp = JsonpReceiver;

'use strict';



var debug$e = function() {};
if ("development" !== 'production') {
  debug$e = browser$2('sockjs-client:sender:jsonp');
}

var form, area;

function createIframe(id) {
  debug$e('createIframe', id);
  try {
    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
    return commonjsGlobal.document.createElement('<iframe name="' + id + '">');
  } catch (x) {
    var iframe = commonjsGlobal.document.createElement('iframe');
    iframe.name = id;
    return iframe;
  }
}

function createForm() {
  debug$e('createForm');
  form = commonjsGlobal.document.createElement('form');
  form.style.display = 'none';
  form.style.position = 'absolute';
  form.method = 'POST';
  form.enctype = 'application/x-www-form-urlencoded';
  form.acceptCharset = 'UTF-8';

  area = commonjsGlobal.document.createElement('textarea');
  area.name = 'd';
  form.appendChild(area);

  commonjsGlobal.document.body.appendChild(form);
}

var jsonp$1 = function(url$1, payload, callback) {
  debug$e(url$1, payload);
  if (!form) {
    createForm();
  }
  var id = 'a' + random.string(8);
  form.target = id;
  form.action = url.addQuery(url.addPath(url$1, '/jsonp_send'), 'i=' + id);

  var iframe = createIframe(id);
  iframe.id = id;
  iframe.style.display = 'none';
  form.appendChild(iframe);

  try {
    area.value = payload;
  } catch (e) {
    // seriously broken browsers get here
  }
  form.submit();

  var completed = function(err) {
    debug$e('completed', id, err);
    if (!iframe.onerror) {
      return;
    }
    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
    // Opera mini doesn't like if we GC iframe
    // immediately, thus this timeout.
    setTimeout(function() {
      debug$e('cleaning up', id);
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }, 500);
    area.value = '';
    // It is not possible to detect if the iframe succeeded or
    // failed to submit our form.
    callback(err);
  };
  iframe.onerror = function() {
    debug$e('onerror', id);
    completed();
  };
  iframe.onload = function() {
    debug$e('onload', id);
    completed();
  };
  iframe.onreadystatechange = function(e) {
    debug$e('onreadystatechange', id, iframe.readyState, e);
    if (iframe.readyState === 'complete') {
      completed();
    }
  };
  return function() {
    debug$e('aborted', id);
    completed(new Error('Aborted'));
  };
};

'use strict';

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// message could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors



function JsonPTransport(transUrl) {
  if (!JsonPTransport.enabled()) {
    throw new Error('Transport created when disabled');
  }
  senderReceiver.call(this, transUrl, '/jsonp', jsonp$1, jsonp);
}

inherits_browser(JsonPTransport, senderReceiver);

JsonPTransport.enabled = function() {
  return !!commonjsGlobal.document;
};

JsonPTransport.transportName = 'jsonp-polling';
JsonPTransport.roundTrips = 1;
JsonPTransport.needBody = true;

var jsonpPolling = JsonPTransport;

'use strict';

var transportList = [
  // streaming transports
  websocket$1
, xhrStreaming
, xdrStreaming
, eventsource$2
, iframeWrap(eventsource$2)

  // polling transports
, htmlfile$1
, iframeWrap(htmlfile$1)
, xhrPolling
, xdrPolling
, iframeWrap(xhrPolling)
, jsonpPolling
];

/* eslint-disable */
/* jscs: disable */
'use strict';

// pulled specific shims from https://github.com/es-shims/es5-shim

var ArrayPrototype = Array.prototype;
var ObjectPrototype = Object.prototype;
var FunctionPrototype = Function.prototype;
var StringPrototype = String.prototype;
var array_slice = ArrayPrototype.slice;

var _toString = ObjectPrototype.toString;
var isFunction$3 = function (val) {
    return ObjectPrototype.toString.call(val) === '[object Function]';
};
var isArray$4 = function isArray(obj) {
    return _toString.call(obj) === '[object Array]';
};
var isString$2 = function isString(obj) {
    return _toString.call(obj) === '[object String]';
};

var supportsDescriptors = Object.defineProperty && (function () {
    try {
        Object.defineProperty({}, 'x', {});
        return true;
    } catch (e) { /* this is ES3 */
        return false;
    }
}());

// Define configurable, writable and non-enumerable props
// if they don't exist.
var defineProperty;
if (supportsDescriptors) {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
        });
    };
} else {
    defineProperty = function (object, name, method, forceAssign) {
        if (!forceAssign && (name in object)) { return; }
        object[name] = method;
    };
}
var defineProperties = function (object, map, forceAssign) {
    for (var name in map) {
        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
          defineProperty(object, name, map[name], forceAssign);
        }
    }
};

var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert " + o + ' to object');
    }
    return Object(o);
};

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(num) {
    var n = +num;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function ToUint32(x) {
    return x >>> 0;
}

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isFunction$3(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(array_slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = Math.max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});

//
// Array
// =====
//

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
defineProperties(Array, { isArray: isArray$4 });


var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxesNonStrict = true;
    var properlyBoxesStrict = true;
    if (method) {
        method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
        });

        method.call([1], function () {
            'use strict';
            properlyBoxesStrict = typeof this === 'string';
        }, 'x');
    }
    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};

defineProperties(ArrayPrototype, {
    forEach: function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && isString$2(this) ? this.split('') : object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isFunction$3(fun)) {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    }
}, !properlyBoxesContext(ArrayPrototype.forEach));

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
    indexOf: function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && isString$2(this) ? this.split('') : toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2IndexOfBug);

//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = StringPrototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === 't' ||
    'test'.split(/(?:)/, -1).length !== 4 ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

        StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
                return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
                return string_split.call(this, separator, limit);
            }

            var output = [],
                flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline  ? 'm' : '') +
                        (separator.extended   ? 'x' : '') + // Proposed for ES6
                        (separator.sticky     ? 'y' : ''), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                ToUint32(limit);
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        ArrayPrototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test('')) {
                    output.push('');
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ('0'.split(void 0, 0).length) {
    StringPrototype.split = function split(separator, limit) {
        if (separator === void 0 && limit === 0) { return []; }
        return string_split.call(this, separator, limit);
    };
}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
defineProperties(StringPrototype, {
    substr: function substr(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}, hasNegativeSubstrBug);

const shims = /*#__PURE__*/Object.freeze({
    __proto__: null
});

'use strict';



// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
// eslint-disable-next-line no-control-regex
var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
  , extraLookup;

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unrollLookup = function(escapable) {
  var i;
  var unrolled = {};
  var c = [];
  for (i = 0; i < 65536; i++) {
    c.push( String.fromCharCode(i) );
  }
  escapable.lastIndex = 0;
  c.join('').replace(escapable, function(a) {
    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    return '';
  });
  escapable.lastIndex = 0;
  return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
var _escape = {
  quote: function(string) {
    var quoted = json3.stringify(string);

    // In most cases this should be very fast and good enough.
    extraEscapable.lastIndex = 0;
    if (!extraEscapable.test(quoted)) {
      return quoted;
    }

    if (!extraLookup) {
      extraLookup = unrollLookup(extraEscapable);
    }

    return quoted.replace(extraEscapable, function(a) {
      return extraLookup[a];
    });
  }
};
var _escape_1 = _escape.quote;

'use strict';

var debug$f = function() {};
if ("development" !== 'production') {
  debug$f = browser$2('sockjs-client:utils:transport');
}

var transport = function(availableTransports) {
  return {
    filterToEnabled: function(transportsWhitelist, info) {
      var transports = {
        main: []
      , facade: []
      };
      if (!transportsWhitelist) {
        transportsWhitelist = [];
      } else if (typeof transportsWhitelist === 'string') {
        transportsWhitelist = [transportsWhitelist];
      }

      availableTransports.forEach(function(trans) {
        if (!trans) {
          return;
        }

        if (trans.transportName === 'websocket' && info.websocket === false) {
          debug$f('disabled from server', 'websocket');
          return;
        }

        if (transportsWhitelist.length &&
            transportsWhitelist.indexOf(trans.transportName) === -1) {
          debug$f('not in whitelist', trans.transportName);
          return;
        }

        if (trans.enabled(info)) {
          debug$f('enabled', trans.transportName);
          transports.main.push(trans);
          if (trans.facadeTransport) {
            transports.facade.push(trans.facadeTransport);
          }
        } else {
          debug$f('disabled', trans.transportName);
        }
      });
      return transports;
    }
  };
};

'use strict';

var logObject = {};
['log', 'debug', 'warn'].forEach(function (level) {
  var levelExists;

  try {
    levelExists = commonjsGlobal.console && commonjsGlobal.console[level] && commonjsGlobal.console[level].apply;
  } catch(e) {
    // do nothing
  }

  logObject[level] = levelExists ? function () {
    return commonjsGlobal.console[level].apply(commonjsGlobal.console, arguments);
  } : (level === 'log' ? function () {} : logObject.log);
});

var log$1 = logObject;

'use strict';

function Event$1(eventType) {
  this.type = eventType;
}

Event$1.prototype.initEvent = function(eventType, canBubble, cancelable) {
  this.type = eventType;
  this.bubbles = canBubble;
  this.cancelable = cancelable;
  this.timeStamp = +new Date();
  return this;
};

Event$1.prototype.stopPropagation = function() {};
Event$1.prototype.preventDefault = function() {};

Event$1.CAPTURING_PHASE = 1;
Event$1.AT_TARGET = 2;
Event$1.BUBBLING_PHASE = 3;

var event$1 = Event$1;

'use strict';

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */

function EventTarget() {
  this._listeners = {};
}

EventTarget.prototype.addEventListener = function(eventType, listener) {
  if (!(eventType in this._listeners)) {
    this._listeners[eventType] = [];
  }
  var arr = this._listeners[eventType];
  // #4
  if (arr.indexOf(listener) === -1) {
    // Make a copy so as not to interfere with a current dispatchEvent.
    arr = arr.concat([listener]);
  }
  this._listeners[eventType] = arr;
};

EventTarget.prototype.removeEventListener = function(eventType, listener) {
  var arr = this._listeners[eventType];
  if (!arr) {
    return;
  }
  var idx = arr.indexOf(listener);
  if (idx !== -1) {
    if (arr.length > 1) {
      // Make a copy so as not to interfere with a current dispatchEvent.
      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
    } else {
      delete this._listeners[eventType];
    }
    return;
  }
};

EventTarget.prototype.dispatchEvent = function() {
  var event = arguments[0];
  var t = event.type;
  // equivalent of Array.prototype.slice.call(arguments, 0);
  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
  // TODO: This doesn't match the real behavior; per spec, onfoo get
  // their place in line from the /first/ time they're set from
  // non-null. Although WebKit bumps it to the end every time it's
  // set.
  if (this['on' + t]) {
    this['on' + t].apply(this, args);
  }
  if (t in this._listeners) {
    // Grab a reference to the listeners list. removeEventListener may alter the list.
    var listeners = this._listeners[t];
    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(this, args);
    }
  }
};

var eventtarget = EventTarget;

'use strict';

var location_1 = commonjsGlobal.location || {
  origin: 'http://localhost:80'
, protocol: 'http:'
, host: 'localhost'
, port: 80
, href: 'http://localhost/'
, hash: ''
};

'use strict';



function CloseEvent() {
  event$1.call(this);
  this.initEvent('close', false, false);
  this.wasClean = false;
  this.code = 0;
  this.reason = '';
}

inherits_browser(CloseEvent, event$1);

var close = CloseEvent;

'use strict';



function TransportMessageEvent(data) {
  event$1.call(this);
  this.initEvent('message', false, false);
  this.data = data;
}

inherits_browser(TransportMessageEvent, event$1);

var transMessage = TransportMessageEvent;

'use strict';

var EventEmitter$b = EventEmitter.EventEmitter
  ;

function XHRFake(/* method, url, payload, opts */) {
  var self = this;
  EventEmitter$b.call(this);

  this.to = setTimeout(function() {
    self.emit('finish', 200, '{}');
  }, XHRFake.timeout);
}

inherits_browser(XHRFake, EventEmitter$b);

XHRFake.prototype.close = function() {
  clearTimeout(this.to);
};

XHRFake.timeout = 2000;

var xhrFake = XHRFake;

'use strict';

var EventEmitter$c = EventEmitter.EventEmitter
  ;

var debug$g = function() {};
if ("development" !== 'production') {
  debug$g = browser$2('sockjs-client:info-ajax');
}

function InfoAjax(url, AjaxObject) {
  EventEmitter$c.call(this);

  var self = this;
  var t0 = +new Date();
  this.xo = new AjaxObject('GET', url);

  this.xo.once('finish', function(status, text) {
    var info, rtt;
    if (status === 200) {
      rtt = (+new Date()) - t0;
      if (text) {
        try {
          info = json3.parse(text);
        } catch (e) {
          debug$g('bad json', text);
        }
      }

      if (!object.isObject(info)) {
        info = {};
      }
    }
    self.emit('finish', info, rtt);
    self.removeAllListeners();
  });
}

inherits_browser(InfoAjax, EventEmitter$c);

InfoAjax.prototype.close = function() {
  this.removeAllListeners();
  this.xo.close();
};

var infoAjax = InfoAjax;

'use strict';

var EventEmitter$d = EventEmitter.EventEmitter
  ;

function InfoReceiverIframe(transUrl) {
  var self = this;
  EventEmitter$d.call(this);

  this.ir = new infoAjax(transUrl, xhrLocal);
  this.ir.once('finish', function(info, rtt) {
    self.ir = null;
    self.emit('message', json3.stringify([info, rtt]));
  });
}

inherits_browser(InfoReceiverIframe, EventEmitter$d);

InfoReceiverIframe.transportName = 'iframe-info-receiver';

InfoReceiverIframe.prototype.close = function() {
  if (this.ir) {
    this.ir.close();
    this.ir = null;
  }
  this.removeAllListeners();
};

var infoIframeReceiver = InfoReceiverIframe;

'use strict';

var EventEmitter$e = EventEmitter.EventEmitter
  ;

var debug$h = function() {};
if ("development" !== 'production') {
  debug$h = browser$2('sockjs-client:info-iframe');
}

function InfoIframe(baseUrl, url) {
  var self = this;
  EventEmitter$e.call(this);

  var go = function() {
    var ifr = self.ifr = new iframe$1(infoIframeReceiver.transportName, url, baseUrl);

    ifr.once('message', function(msg) {
      if (msg) {
        var d;
        try {
          d = json3.parse(msg);
        } catch (e) {
          debug$h('bad json', msg);
          self.emit('finish');
          self.close();
          return;
        }

        var info = d[0], rtt = d[1];
        self.emit('finish', info, rtt);
      }
      self.close();
    });

    ifr.once('close', function() {
      self.emit('finish');
      self.close();
    });
  };

  // TODO this seems the same as the 'needBody' from transports
  if (!commonjsGlobal.document.body) {
    event.attachEvent('load', go);
  } else {
    go();
  }
}

inherits_browser(InfoIframe, EventEmitter$e);

InfoIframe.enabled = function() {
  return iframe$1.enabled();
};

InfoIframe.prototype.close = function() {
  if (this.ifr) {
    this.ifr.close();
  }
  this.removeAllListeners();
  this.ifr = null;
};

var infoIframe = InfoIframe;

'use strict';

var EventEmitter$f = EventEmitter.EventEmitter
  ;

var debug$i = function() {};
if ("development" !== 'production') {
  debug$i = browser$2('sockjs-client:info-receiver');
}

function InfoReceiver(baseUrl, urlInfo) {
  debug$i(baseUrl);
  var self = this;
  EventEmitter$f.call(this);

  setTimeout(function() {
    self.doXhr(baseUrl, urlInfo);
  }, 0);
}

inherits_browser(InfoReceiver, EventEmitter$f);

// TODO this is currently ignoring the list of available transports and the whitelist

InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
  // determine method of CORS support (if needed)
  if (urlInfo.sameOrigin) {
    return new infoAjax(url, xhrLocal);
  }
  if (xhrCors.enabled) {
    return new infoAjax(url, xhrCors);
  }
  if (xdr.enabled && urlInfo.sameScheme) {
    return new infoAjax(url, xdr);
  }
  if (infoIframe.enabled()) {
    return new infoIframe(baseUrl, url);
  }
  return new infoAjax(url, xhrFake);
};

InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
  var self = this
    , url$1 = url.addPath(baseUrl, '/info')
    ;
  debug$i('doXhr', url$1);

  this.xo = InfoReceiver._getReceiver(baseUrl, url$1, urlInfo);

  this.timeoutRef = setTimeout(function() {
    debug$i('timeout');
    self._cleanup(false);
    self.emit('finish');
  }, InfoReceiver.timeout);

  this.xo.once('finish', function(info, rtt) {
    debug$i('finish', info, rtt);
    self._cleanup(true);
    self.emit('finish', info, rtt);
  });
};

InfoReceiver.prototype._cleanup = function(wasClean) {
  debug$i('_cleanup');
  clearTimeout(this.timeoutRef);
  this.timeoutRef = null;
  if (!wasClean && this.xo) {
    this.xo.close();
  }
  this.xo = null;
};

InfoReceiver.prototype.close = function() {
  debug$i('close');
  this.removeAllListeners();
  this._cleanup(false);
};

InfoReceiver.timeout = 8000;

var infoReceiver = InfoReceiver;

'use strict';



function FacadeJS(transport) {
  this._transport = transport;
  transport.on('message', this._transportMessage.bind(this));
  transport.on('close', this._transportClose.bind(this));
}

FacadeJS.prototype._transportClose = function(code, reason) {
  iframe.postMessage('c', json3.stringify([code, reason]));
};
FacadeJS.prototype._transportMessage = function(frame) {
  iframe.postMessage('t', frame);
};
FacadeJS.prototype._send = function(data) {
  this._transport.send(data);
};
FacadeJS.prototype._close = function() {
  this._transport.close();
  this._transport.removeAllListeners();
};

var facade = FacadeJS;

'use strict';



var debug$j = function() {};
if ("development" !== 'production') {
  debug$j = browser$2('sockjs-client:iframe-bootstrap');
}

var iframeBootstrap = function(SockJS, availableTransports) {
  var transportMap = {};
  availableTransports.forEach(function(at) {
    if (at.facadeTransport) {
      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
    }
  });

  // hard-coded for the info iframe
  // TODO see if we can make this more dynamic
  transportMap[infoIframeReceiver.transportName] = infoIframeReceiver;
  var parentOrigin;

  /* eslint-disable camelcase */
  SockJS.bootstrap_iframe = function() {
    /* eslint-enable camelcase */
    var facade$1;
    iframe.currentWindowId = location_1.hash.slice(1);
    var onMessage = function(e) {
      if (e.source !== parent) {
        return;
      }
      if (typeof parentOrigin === 'undefined') {
        parentOrigin = e.origin;
      }
      if (e.origin !== parentOrigin) {
        return;
      }

      var iframeMessage;
      try {
        iframeMessage = json3.parse(e.data);
      } catch (ignored) {
        debug$j('bad json', e.data);
        return;
      }

      if (iframeMessage.windowId !== iframe.currentWindowId) {
        return;
      }
      switch (iframeMessage.type) {
      case 's':
        var p;
        try {
          p = json3.parse(iframeMessage.data);
        } catch (ignored) {
          debug$j('bad json', iframeMessage.data);
          break;
        }
        var version = p[0];
        var transport = p[1];
        var transUrl = p[2];
        var baseUrl = p[3];
        debug$j(version, transport, transUrl, baseUrl);
        // change this to semver logic
        if (version !== SockJS.version) {
          throw new Error('Incompatible SockJS! Main site uses:' +
                    ' "' + version + '", the iframe:' +
                    ' "' + SockJS.version + '".');
        }

        if (!url.isOriginEqual(transUrl, location_1.href) ||
            !url.isOriginEqual(baseUrl, location_1.href)) {
          throw new Error('Can\'t connect to different domain from within an ' +
                    'iframe. (' + location_1.href + ', ' + transUrl + ', ' + baseUrl + ')');
        }
        facade$1 = new facade(new transportMap[transport](transUrl, baseUrl));
        break;
      case 'm':
        facade$1._send(iframeMessage.data);
        break;
      case 'c':
        if (facade$1) {
          facade$1._close();
        }
        facade$1 = null;
        break;
      }
    };

    event.attachEvent('message', onMessage);

    // Start
    iframe.postMessage('s');
  };
};

'use strict';





var debug$k = function() {};
if ("development" !== 'production') {
  debug$k = browser$2('sockjs-client:main');
}

var transports;

// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
function SockJS(url$1, protocols, options) {
  if (!(this instanceof SockJS)) {
    return new SockJS(url$1, protocols, options);
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
  }
  eventtarget.call(this);

  this.readyState = SockJS.CONNECTING;
  this.extensions = '';
  this.protocol = '';

  // non-standard extension
  options = options || {};
  if (options.protocols_whitelist) {
    log$1.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
  }
  this._transportsWhitelist = options.transports;
  this._transportOptions = options.transportOptions || {};
  this._timeout = options.timeout || 0;

  var sessionId = options.sessionId || 8;
  if (typeof sessionId === 'function') {
    this._generateSessionId = sessionId;
  } else if (typeof sessionId === 'number') {
    this._generateSessionId = function() {
      return random.string(sessionId);
    };
  } else {
    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
  }

  this._server = options.server || random.numberString(1000);

  // Step 1 of WS spec - parse and validate the url. Issue #8
  var parsedUrl = new urlParse$1(url$1);
  if (!parsedUrl.host || !parsedUrl.protocol) {
    throw new SyntaxError("The URL '" + url$1 + "' is invalid");
  } else if (parsedUrl.hash) {
    throw new SyntaxError('The URL must not contain a fragment');
  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
  }

  var secure = parsedUrl.protocol === 'https:';
  // Step 2 - don't allow secure origin with an insecure protocol
  if (location_1.protocol === 'https:' && !secure) {
    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
  }

  // Step 3 - check port access - no need here
  // Step 4 - parse protocols argument
  if (!protocols) {
    protocols = [];
  } else if (!Array.isArray(protocols)) {
    protocols = [protocols];
  }

  // Step 5 - check protocols argument
  var sortedProtocols = protocols.sort();
  sortedProtocols.forEach(function(proto, i) {
    if (!proto) {
      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
    }
    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
    }
  });

  // Step 6 - convert origin
  var o = url.getOrigin(location_1.href);
  this._origin = o ? o.toLowerCase() : null;

  // remove the trailing slash
  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

  // store the sanitized url
  this.url = parsedUrl.href;
  debug$k('using url', this.url);

  // Step 7 - start connection in background
  // obtain server info
  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
  this._urlInfo = {
    nullOrigin: !browser$3.hasDomain()
  , sameOrigin: url.isOriginEqual(this.url, location_1.href)
  , sameScheme: url.isSchemeEqual(this.url, location_1.href)
  };

  this._ir = new infoReceiver(this.url, this._urlInfo);
  this._ir.once('finish', this._receiveInfo.bind(this));
}

inherits_browser(SockJS, eventtarget);

function userSetCode(code) {
  return code === 1000 || (code >= 3000 && code <= 4999);
}

SockJS.prototype.close = function(code, reason) {
  // Step 1
  if (code && !userSetCode(code)) {
    throw new Error('InvalidAccessError: Invalid code');
  }
  // Step 2.4 states the max is 123 bytes, but we are just checking length
  if (reason && reason.length > 123) {
    throw new SyntaxError('reason argument has an invalid length');
  }

  // Step 3.1
  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
    return;
  }

  // TODO look at docs to determine how to set this
  var wasClean = true;
  this._close(code || 1000, reason || 'Normal closure', wasClean);
};

SockJS.prototype.send = function(data) {
  // #13 - convert anything non-string to string
  // TODO this currently turns objects into [object Object]
  if (typeof data !== 'string') {
    data = '' + data;
  }
  if (this.readyState === SockJS.CONNECTING) {
    throw new Error('InvalidStateError: The connection has not been established yet');
  }
  if (this.readyState !== SockJS.OPEN) {
    return;
  }
  this._transport.send(_escape.quote(data));
};

SockJS.version = version$2;

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._receiveInfo = function(info, rtt) {
  debug$k('_receiveInfo', rtt);
  this._ir = null;
  if (!info) {
    this._close(1002, 'Cannot connect to server');
    return;
  }

  // establish a round-trip timeout (RTO) based on the
  // round-trip time (RTT)
  this._rto = this.countRTO(rtt);
  // allow server to override url used for the actual transport
  this._transUrl = info.base_url ? info.base_url : this.url;
  info = object.extend(info, this._urlInfo);
  debug$k('info', info);
  // determine list of desired and supported transports
  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
  this._transports = enabledTransports.main;
  debug$k(this._transports.length + ' enabled transports');

  this._connect();
};

SockJS.prototype._connect = function() {
  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
    debug$k('attempt', Transport.transportName);
    if (Transport.needBody) {
      if (!commonjsGlobal.document.body ||
          (typeof commonjsGlobal.document.readyState !== 'undefined' &&
            commonjsGlobal.document.readyState !== 'complete' &&
            commonjsGlobal.document.readyState !== 'interactive')) {
        debug$k('waiting for body');
        this._transports.unshift(Transport);
        event.attachEvent('load', this._connect.bind(this));
        return;
      }
    }

    // calculate timeout based on RTO and round trips. Default to 5s
    var timeoutMs = Math.max(this._timeout, (this._rto * Transport.roundTrips) || 5000);
    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
    debug$k('using timeout', timeoutMs);

    var transportUrl = url.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
    var options = this._transportOptions[Transport.transportName];
    debug$k('transport url', transportUrl);
    var transportObj = new Transport(transportUrl, this._transUrl, options);
    transportObj.on('message', this._transportMessage.bind(this));
    transportObj.once('close', this._transportClose.bind(this));
    transportObj.transportName = Transport.transportName;
    this._transport = transportObj;

    return;
  }
  this._close(2000, 'All transports failed', false);
};

SockJS.prototype._transportTimeout = function() {
  debug$k('_transportTimeout');
  if (this.readyState === SockJS.CONNECTING) {
    if (this._transport) {
      this._transport.close();
    }

    this._transportClose(2007, 'Transport timed out');
  }
};

SockJS.prototype._transportMessage = function(msg) {
  debug$k('_transportMessage', msg);
  var self = this
    , type = msg.slice(0, 1)
    , content = msg.slice(1)
    , payload
    ;

  // first check for messages that don't need a payload
  switch (type) {
    case 'o':
      this._open();
      return;
    case 'h':
      this.dispatchEvent(new event$1('heartbeat'));
      debug$k('heartbeat', this.transport);
      return;
  }

  if (content) {
    try {
      payload = json3.parse(content);
    } catch (e) {
      debug$k('bad json', content);
    }
  }

  if (typeof payload === 'undefined') {
    debug$k('empty payload', content);
    return;
  }

  switch (type) {
    case 'a':
      if (Array.isArray(payload)) {
        payload.forEach(function(p) {
          debug$k('message', self.transport, p);
          self.dispatchEvent(new transMessage(p));
        });
      }
      break;
    case 'm':
      debug$k('message', this.transport, payload);
      this.dispatchEvent(new transMessage(payload));
      break;
    case 'c':
      if (Array.isArray(payload) && payload.length === 2) {
        this._close(payload[0], payload[1], true);
      }
      break;
  }
};

SockJS.prototype._transportClose = function(code, reason) {
  debug$k('_transportClose', this.transport, code, reason);
  if (this._transport) {
    this._transport.removeAllListeners();
    this._transport = null;
    this.transport = null;
  }

  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
    this._connect();
    return;
  }

  this._close(code, reason);
};

SockJS.prototype._open = function() {
  debug$k('_open', this._transport && this._transport.transportName, this.readyState);
  if (this.readyState === SockJS.CONNECTING) {
    if (this._transportTimeoutId) {
      clearTimeout(this._transportTimeoutId);
      this._transportTimeoutId = null;
    }
    this.readyState = SockJS.OPEN;
    this.transport = this._transport.transportName;
    this.dispatchEvent(new event$1('open'));
    debug$k('connected', this.transport);
  } else {
    // The server might have been restarted, and lost track of our
    // connection.
    this._close(1006, 'Server lost session');
  }
};

SockJS.prototype._close = function(code, reason, wasClean) {
  debug$k('_close', this.transport, code, reason, wasClean, this.readyState);
  var forceFail = false;

  if (this._ir) {
    forceFail = true;
    this._ir.close();
    this._ir = null;
  }
  if (this._transport) {
    this._transport.close();
    this._transport = null;
    this.transport = null;
  }

  if (this.readyState === SockJS.CLOSED) {
    throw new Error('InvalidStateError: SockJS has already been closed');
  }

  this.readyState = SockJS.CLOSING;
  setTimeout(function() {
    this.readyState = SockJS.CLOSED;

    if (forceFail) {
      this.dispatchEvent(new event$1('error'));
    }

    var e = new close('close');
    e.wasClean = wasClean || false;
    e.code = code || 1000;
    e.reason = reason;

    this.dispatchEvent(e);
    this.onmessage = this.onclose = this.onerror = null;
    debug$k('disconnected');
  }.bind(this), 0);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
SockJS.prototype.countRTO = function(rtt) {
  // In a local environment, when using IE8/9 and the `jsonp-polling`
  // transport the time needed to establish a connection (the time that pass
  // from the opening of the transport to the call of `_dispatchOpen`) is
  // around 200msec (the lower bound used in the article above) and this
  // causes spurious timeouts. For this reason we calculate a value slightly
  // larger than that used in the article.
  if (rtt > 100) {
    return 4 * rtt; // rto > 400msec
  }
  return 300 + rtt; // 300msec < rto <= 400msec
};

var main = function(availableTransports) {
  transports = transport(availableTransports);
  iframeBootstrap(SockJS, availableTransports);
  return SockJS;
};

'use strict';



var entry = main(transportList);

// TODO can't get rid of this until all servers do
if ('_sockjs_onload' in commonjsGlobal) {
  setTimeout(commonjsGlobal._sockjs_onload, 1);
}

var webstomp = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  'object' === 'object' && 'object' !== 'undefined' ? module.exports = factory() :
  typeof undefined === 'function' && undefined.amd ? undefined(factory) :
  (global.webstomp = factory());
}(commonjsGlobal, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var VERSIONS = {
      V1_0: '1.0',
      V1_1: '1.1',
      V1_2: '1.2',
      // Versions of STOMP specifications supported
      supportedVersions: function supportedVersions() {
          return '1.2,1.1,1.0';
      },
      supportedProtocols: function supportedProtocols() {
          return ['v10.stomp', 'v11.stomp', 'v12.stomp'];
      }
  };

  var PROTOCOLS_VERSIONS = {
      'v10.stomp': VERSIONS.V1_0,
      'v11.stomp': VERSIONS.V1_1,
      'v12.stomp': VERSIONS.V1_2
  };

  function getSupportedVersion(protocol, debug) {
      var knownVersion = PROTOCOLS_VERSIONS[protocol];
      if (!knownVersion && debug) {
          debug('DEPRECATED: ' + protocol + ' is not a recognized STOMP version. In next major client version, this will close the connection.');
      }
      // 2nd temporary fallback if the protocol
      // does not match a supported STOMP version
      // This fallback will be removed in next major version
      return knownVersion || VERSIONS.V1_2;
  }

  // Define constants for bytes used throughout the code.
  var BYTES = {
      // LINEFEED byte (octet 10)
      LF: '\x0A',
      // NULL byte (octet 0)
      NULL: '\x00'
  };

  // utility function to trim any whitespace before and after a string
  var trim = function trim(str) {
      return str.replace(/^\s+|\s+$/g, '');
  };

  // from https://coolaj86.com/articles/unicode-string-to-a-utf-8-typed-array-buffer-in-javascript/
  function unicodeStringToTypedArray(s) {
      var escstr = encodeURIComponent(s);
      var binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode('0x' + p1);
      });
      var arr = Array.prototype.map.call(binstr, function (c) {
          return c.charCodeAt(0);
      });
      return new Uint8Array(arr);
  }

  // from https://coolaj86.com/articles/unicode-string-to-a-utf-8-typed-array-buffer-in-javascript/
  function typedArrayToUnicodeString(ua) {
      var binstr = String.fromCharCode.apply(String, toConsumableArray(ua));
      var escstr = binstr.replace(/(.)/g, function (m, p) {
          var code = p.charCodeAt(0).toString(16).toUpperCase();
          if (code.length < 2) {
              code = '0' + code;
          }
          return '%' + code;
      });
      return decodeURIComponent(escstr);
  }

  // Compute the size of a UTF-8 string by counting its number of bytes
  // (and not the number of characters composing the string)
  function sizeOfUTF8(s) {
      if (!s) return 0;
      return encodeURIComponent(s).match(/%..|./g).length;
  }

  function createId() {
      var ts = new Date().getTime();
      var rand = Math.floor(Math.random() * 1000);
      return ts + '-' + rand;
  }

  // [STOMP Frame](http://stomp.github.com/stomp-specification-1.1.html#STOMP_Frames) Class

  var Frame = function () {

      // Frame constructor
      function Frame(command) {
          var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
          classCallCheck(this, Frame);

          this.command = command;
          this.headers = headers;
          this.body = body;
      }

      // Provides a textual representation of the frame
      // suitable to be sent to the server


      createClass(Frame, [{
          key: 'toString',
          value: function toString() {
              var _this = this;

              var lines = [this.command],
                  skipContentLength = this.headers['content-length'] === false;
              if (skipContentLength) delete this.headers['content-length'];

              Object.keys(this.headers).forEach(function (name) {
                  var value = _this.headers[name];
                  lines.push(name + ':' + value);
              });

              if (this.body && !skipContentLength) {
                  lines.push('content-length:' + sizeOfUTF8(this.body));
              }

              lines.push(BYTES.LF + this.body);

              return lines.join(BYTES.LF);
          }

          // Unmarshall a single STOMP frame from a `data` string

      }], [{
          key: 'unmarshallSingle',
          value: function unmarshallSingle(data) {
              // search for 2 consecutives LF byte to split the command
              // and headers from the body
              var divider = data.search(new RegExp(BYTES.LF + BYTES.LF)),
                  headerLines = data.substring(0, divider).split(BYTES.LF),
                  command = headerLines.shift(),
                  headers = {},
                  body = '',

              // skip the 2 LF bytes that divides the headers from the body
              bodyIndex = divider + 2;

              // Parse headers in reverse order so that for repeated headers, the 1st
              // value is used
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = headerLines.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var line = _step.value;

                      var idx = line.indexOf(':');
                      headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
                  }
                  // Parse body
                  // check for content-length or topping at the first NULL byte found.
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              if (headers['content-length']) {
                  var len = parseInt(headers['content-length'], 10);
                  body = ('' + data).substring(bodyIndex, bodyIndex + len);
              } else {
                  var chr = null;
                  for (var i = bodyIndex; i < data.length; i++) {
                      chr = data.charAt(i);
                      if (chr === BYTES.NULL) break;
                      body += chr;
                  }
              }

              return new Frame(command, headers, body);
          }

          // Split the data before unmarshalling every single STOMP frame.
          // Web socket servers can send multiple frames in a single websocket message.
          // If the message size exceeds the websocket message size, then a single
          // frame can be fragmented across multiple messages.
          //
          // `datas` is a string.
          //
          // returns an *array* of Frame objects

      }, {
          key: 'unmarshall',
          value: function unmarshall(datas) {
              // split and unmarshall *multiple STOMP frames* contained in a *single WebSocket frame*.
              // The data is split when a NULL byte (followed by zero or many LF bytes) is found
              var frames = datas.split(new RegExp(BYTES.NULL + BYTES.LF + '*')),
                  firstFrames = frames.slice(0, -1),
                  lastFrame = frames.slice(-1)[0],
                  r = {
                  frames: firstFrames.map(function (f) {
                      return Frame.unmarshallSingle(f);
                  }),
                  partial: ''
              };

              // If this contains a final full message or just a acknowledgement of a PING
              // without any other content, process this frame, otherwise return the
              // contents of the buffer to the caller.
              if (lastFrame === BYTES.LF || lastFrame.search(RegExp(BYTES.NULL + BYTES.LF + '*$')) !== -1) {
                  r.frames.push(Frame.unmarshallSingle(lastFrame));
              } else {
                  r.partial = lastFrame;
              }

              return r;
          }

          // Marshall a Stomp frame

      }, {
          key: 'marshall',
          value: function marshall(command, headers, body) {
              var frame = new Frame(command, headers, body);
              return frame.toString() + BYTES.NULL;
          }
      }]);
      return Frame;
  }();

  // STOMP Client Class
  //
  // All STOMP protocol is exposed as methods of this class (`connect()`,
  // `send()`, etc.)

  var Client = function () {
      function Client(ws) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          classCallCheck(this, Client);

          // cannot have default options object + destructuring in the same time in method signature
          var _options$binary = options.binary,
              binary = _options$binary === undefined ? false : _options$binary,
              _options$heartbeat = options.heartbeat,
              heartbeat = _options$heartbeat === undefined ? { outgoing: 10000, incoming: 10000 } : _options$heartbeat,
              _options$debug = options.debug,
              debug = _options$debug === undefined ? true : _options$debug,
              _options$protocols = options.protocols,
              protocols = _options$protocols === undefined ? [] : _options$protocols;


          this.ws = ws;
          this.ws.binaryType = 'arraybuffer';
          this.isBinary = !!binary;
          this.hasDebug = !!debug;
          this.connected = false;
          // Heartbeat properties of the client
          // outgoing: send heartbeat every 10s by default (value is in ms)
          // incoming: expect to receive server heartbeat at least every 10s by default
          // falsy value means no heartbeat hence 0,0
          this.heartbeat = heartbeat || { outgoing: 0, incoming: 0 };
          // maximum *WebSocket* frame size sent by the client. If the STOMP frame
          // is bigger than this value, the STOMP frame will be sent using multiple
          // WebSocket frames (default is 16KiB)
          this.maxWebSocketFrameSize = 16 * 1024;
          // subscription callbacks indexed by subscriber's ID
          this.subscriptions = {};
          this.partialData = '';
          this.protocols = protocols;
      }

      // //// Debugging
      //
      // By default, debug messages are logged in the window's console if it is defined.
      // This method is called for every actual transmission of the STOMP frames over the
      // WebSocket.
      //
      // It is possible to set a `debug(message, data)` method
      // on a client instance to handle differently the debug messages:
      //
      //     client.debug = function(str) {
      //         // append the debug log to a #debug div
      //         $("#debug").append(str + "\n");
      //     };


      createClass(Client, [{
          key: 'debug',
          value: function debug() {
              var _console;

              if (this.hasDebug) (_console = console).log.apply(_console, arguments);
          }

          // [CONNECT Frame](http://stomp.github.com/stomp-specification-1.1.html#CONNECT_or_STOMP_Frame)
          //
          // The `connect` method accepts different number of arguments and types:
          //
          // * `connect(headers, connectCallback)`
          // * `connect(headers, connectCallback, errorCallback)`
          // * `connect(login, passcode, connectCallback)`
          // * `connect(login, passcode, connectCallback, errorCallback)`
          // * `connect(login, passcode, connectCallback, errorCallback, host)`
          //
          // The errorCallback is optional and the 2 first forms allow to pass other
          // headers in addition to `client`, `passcode` and `host`.

      }, {
          key: 'connect',
          value: function connect() {
              var _this = this;

              var _parseConnect2 = this._parseConnect.apply(this, arguments),
                  _parseConnect3 = slicedToArray(_parseConnect2, 3),
                  headers = _parseConnect3[0],
                  connectCallback = _parseConnect3[1],
                  errorCallback = _parseConnect3[2];

              this.connectCallback = connectCallback;
              this.debug('Opening Web Socket...');
              this.ws.onmessage = function (evt) {
                  var data = evt.data;
                  if (evt.data instanceof ArrayBuffer) {
                      data = typedArrayToUnicodeString(new Uint8Array(evt.data));
                  }
                  _this.serverActivity = Date.now();
                  // heartbeat
                  if (data === BYTES.LF) {
                      _this.debug('<<< PONG');
                      return;
                  }
                  _this.debug('<<< ' + data);
                  // Handle STOMP frames received from the server
                  // The unmarshall function returns the frames parsed and any remaining
                  // data from partial frames.
                  var unmarshalledData = Frame.unmarshall(_this.partialData + data);
                  _this.partialData = unmarshalledData.partial;
                  unmarshalledData.frames.forEach(function (frame) {
                      switch (frame.command) {
                          // [CONNECTED Frame](http://stomp.github.com/stomp-specification-1.1.html#CONNECTED_Frame)
                          case 'CONNECTED':
                              _this.debug('connected to server ' + frame.headers.server);
                              _this.connected = true;
                              _this.version = frame.headers.version;
                              _this._setupHeartbeat(frame.headers);
                              if (connectCallback) connectCallback(frame);
                              break;
                          // [MESSAGE Frame](http://stomp.github.com/stomp-specification-1.1.html#MESSAGE)
                          case 'MESSAGE':
                              // the `onreceive` callback is registered when the client calls
                              // `subscribe()`.
                              // If there is registered subscription for the received message,
                              // we used the default `onreceive` method that the client can set.
                              // This is useful for subscriptions that are automatically created
                              // on the browser side (e.g. [RabbitMQ's temporary
                              // queues](http://www.rabbitmq.com/stomp.html)).
                              var subscription = frame.headers.subscription;
                              var onreceive = _this.subscriptions[subscription] || _this.onreceive;
                              if (onreceive) {
                                  // 1.2 define ack header if ack is set to client
                                  // and this header must be used for ack/nack
                                  var messageID = _this.version === VERSIONS.V1_2 && frame.headers.ack || frame.headers['message-id'];
                                  // add `ack()` and `nack()` methods directly to the returned frame
                                  // so that a simple call to `message.ack()` can acknowledge the message.
                                  frame.ack = _this.ack.bind(_this, messageID, subscription);
                                  frame.nack = _this.nack.bind(_this, messageID, subscription);
                                  onreceive(frame);
                              } else {
                                  _this.debug('Unhandled received MESSAGE: ' + frame);
                              }
                              break;
                          // [RECEIPT Frame](http://stomp.github.com/stomp-specification-1.1.html#RECEIPT)
                          //
                          // The client instance can set its `onreceipt` field to a function taking
                          // a frame argument that will be called when a receipt is received from
                          // the server:
                          //
                          //     client.onreceipt = function(frame) {
                          //       receiptID = frame.headers['receipt-id'];
                          //       ...
                          //     }
                          case 'RECEIPT':
                              if (_this.onreceipt) _this.onreceipt(frame);
                              break;
                          // [ERROR Frame](http://stomp.github.com/stomp-specification-1.1.html#ERROR)
                          case 'ERROR':
                              if (errorCallback) errorCallback(frame);
                              break;
                          default:
                              _this.debug('Unhandled frame: ' + frame);
                      }
                  });
              };
              this.ws.onclose = function (event) {
                  _this.debug('Whoops! Lost connection to ' + _this.ws.url + ':', { event: event });
                  _this._cleanUp();
                  if (errorCallback) errorCallback(event);
              };
              this.ws.onopen = function () {
                  _this.debug('Web Socket Opened...');
                  // 1st protocol fallback on user 1st protocols options
                  // to prevent edge case where server does not comply and respond with a choosen protocol
                  // or when ws client does not handle protocol property very well
                  headers['accept-version'] = getSupportedVersion(_this.ws.protocol || _this.protocols[0], _this.debug.bind(_this));
                  // Check if we already have heart-beat in headers before adding them
                  if (!headers['heart-beat']) {
                      headers['heart-beat'] = [_this.heartbeat.outgoing, _this.heartbeat.incoming].join(',');
                  }
                  _this._transmit('CONNECT', headers);
              };
              if (this.ws.readyState === this.ws.OPEN) {
                  this.ws.onopen();
              }
          }

          // [DISCONNECT Frame](http://stomp.github.com/stomp-specification-1.1.html#DISCONNECT)

      }, {
          key: 'disconnect',
          value: function disconnect(disconnectCallback) {
              var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

              this._transmit('DISCONNECT', headers);
              // Discard the onclose callback to avoid calling the errorCallback when
              // the client is properly disconnected.
              this.ws.onclose = null;
              this.ws.close();
              this._cleanUp();
              // TODO: what's the point of this callback disconnect is not async
              if (disconnectCallback) disconnectCallback();
          }

          // [SEND Frame](http://stomp.github.com/stomp-specification-1.1.html#SEND)
          //
          // * `destination` is MANDATORY.

      }, {
          key: 'send',
          value: function send(destination) {
              var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
              var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

              var hdrs = Object.assign({}, headers);
              hdrs.destination = destination;
              this._transmit('SEND', hdrs, body);
          }

          // [BEGIN Frame](http://stomp.github.com/stomp-specification-1.1.html#BEGIN)
          //
          // If no transaction ID is passed, one will be created automatically

      }, {
          key: 'begin',
          value: function begin() {
              var transaction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tx-' + createId();

              this._transmit('BEGIN', { transaction: transaction });
              return {
                  id: transaction,
                  commit: this.commit.bind(this, transaction),
                  abort: this.abort.bind(this, transaction)
              };
          }

          // [COMMIT Frame](http://stomp.github.com/stomp-specification-1.1.html#COMMIT)
          //
          // * `transaction` is MANDATORY.
          //
          // It is preferable to commit a transaction by calling `commit()` directly on
          // the object returned by `client.begin()`:
          //
          //     var tx = client.begin(txid);
          //     ...
          //     tx.commit();

      }, {
          key: 'commit',
          value: function commit(transaction) {
              this._transmit('COMMIT', { transaction: transaction });
          }

          // [ABORT Frame](http://stomp.github.com/stomp-specification-1.1.html#ABORT)
          //
          // * `transaction` is MANDATORY.
          //
          // It is preferable to abort a transaction by calling `abort()` directly on
          // the object returned by `client.begin()`:
          //
          //     var tx = client.begin(txid);
          //     ...
          //     tx.abort();

      }, {
          key: 'abort',
          value: function abort(transaction) {
              this._transmit('ABORT', { transaction: transaction });
          }

          // [ACK Frame](http://stomp.github.com/stomp-specification-1.1.html#ACK)
          //
          // * `messageID` & `subscription` are MANDATORY.
          //
          // It is preferable to acknowledge a message by calling `ack()` directly
          // on the message handled by a subscription callback:
          //
          //     client.subscribe(destination,
          //       function(message) {
          //         // process the message
          //         // acknowledge it
          //         message.ack();
          //       },
          //       {'ack': 'client'}
          //     );

      }, {
          key: 'ack',
          value: function ack(messageID, subscription) {
              var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

              var hdrs = Object.assign({}, headers);
              // 1.2 change id header name from message-id to id
              var idAttr = this.version === VERSIONS.V1_2 ? 'id' : 'message-id';
              hdrs[idAttr] = messageID;
              hdrs.subscription = subscription;
              this._transmit('ACK', hdrs);
          }

          // [NACK Frame](http://stomp.github.com/stomp-specification-1.1.html#NACK)
          //
          // * `messageID` & `subscription` are MANDATORY.
          //
          // It is preferable to nack a message by calling `nack()` directly on the
          // message handled by a subscription callback:
          //
          //     client.subscribe(destination,
          //       function(message) {
          //         // process the message
          //         // an error occurs, nack it
          //         message.nack();
          //       },
          //       {'ack': 'client'}
          //     );

      }, {
          key: 'nack',
          value: function nack(messageID, subscription) {
              var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

              var hdrs = Object.assign({}, headers);
              // 1.2 change id header name from message-id to id
              var idAttr = this.version === VERSIONS.V1_2 ? 'id' : 'message-id';
              hdrs[idAttr] = messageID;
              hdrs.subscription = subscription;
              this._transmit('NACK', hdrs);
          }

          // [SUBSCRIBE Frame](http://stomp.github.com/stomp-specification-1.1.html#SUBSCRIBE)

      }, {
          key: 'subscribe',
          value: function subscribe(destination, callback) {
              var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

              var hdrs = Object.assign({}, headers);
              // for convenience if the `id` header is not set, we create a new one for this client
              // that will be returned to be able to unsubscribe this subscription
              if (!hdrs.id) hdrs.id = 'sub-' + createId();
              hdrs.destination = destination;
              this.subscriptions[hdrs.id] = callback;
              this._transmit('SUBSCRIBE', hdrs);
              return {
                  id: hdrs.id,
                  unsubscribe: this.unsubscribe.bind(this, hdrs.id)
              };
          }

          // [UNSUBSCRIBE Frame](http://stomp.github.com/stomp-specification-1.1.html#UNSUBSCRIBE)
          //
          // * `id` is MANDATORY.
          //
          // It is preferable to unsubscribe from a subscription by calling
          // `unsubscribe()` directly on the object returned by `client.subscribe()`:
          //
          //     var subscription = client.subscribe(destination, onmessage);
          //     ...
          //     subscription.unsubscribe(headers);

      }, {
          key: 'unsubscribe',
          value: function unsubscribe(id) {
              var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

              var hdrs = Object.assign({}, headers);
              delete this.subscriptions[id];
              hdrs.id = id;
              this._transmit('UNSUBSCRIBE', hdrs);
          }

          // Clean up client resources when it is disconnected or the server did not
          // send heart beats in a timely fashion

      }, {
          key: '_cleanUp',
          value: function _cleanUp() {
              this.connected = false;
              clearInterval(this.pinger);
              clearInterval(this.ponger);
          }

          // Base method to transmit any stomp frame

      }, {
          key: '_transmit',
          value: function _transmit(command, headers, body) {
              var out = Frame.marshall(command, headers, body);
              this.debug('>>> ' + out, { frame: { command: command, headers: headers, body: body } });
              this._wsSend(out);
          }
      }, {
          key: '_wsSend',
          value: function _wsSend(data) {
              if (this.isBinary) data = unicodeStringToTypedArray(data);
              this.debug('>>> length ' + data.length);
              // if necessary, split the *STOMP* frame to send it on many smaller
              // *WebSocket* frames
              while (true) {
                  if (data.length > this.maxWebSocketFrameSize) {
                      this.ws.send(data.slice(0, this.maxWebSocketFrameSize));
                      data = data.slice(this.maxWebSocketFrameSize);
                      this.debug('remaining = ' + data.length);
                  } else {
                      return this.ws.send(data);
                  }
              }
          }

          // Heart-beat negotiation

      }, {
          key: '_setupHeartbeat',
          value: function _setupHeartbeat(headers) {
              var _this2 = this;

              if (this.version !== VERSIONS.V1_1 && this.version !== VERSIONS.V1_2) return;

              // heart-beat header received from the server looks like:
              //
              //     heart-beat: sx, sy

              var _split$map = (headers['heart-beat'] || '0,0').split(',').map(function (v) {
                  return parseInt(v, 10);
              }),
                  _split$map2 = slicedToArray(_split$map, 2),
                  serverOutgoing = _split$map2[0],
                  serverIncoming = _split$map2[1];

              if (!(this.heartbeat.outgoing === 0 || serverIncoming === 0)) {
                  var ttl = Math.max(this.heartbeat.outgoing, serverIncoming);
                  this.debug('send PING every ' + ttl + 'ms');
                  this.pinger = setInterval(function () {
                      _this2._wsSend(BYTES.LF);
                      _this2.debug('>>> PING');
                  }, ttl);
              }

              if (!(this.heartbeat.incoming === 0 || serverOutgoing === 0)) {
                  var _ttl = Math.max(this.heartbeat.incoming, serverOutgoing);
                  this.debug('check PONG every ' + _ttl + 'ms');
                  this.ponger = setInterval(function () {
                      var delta = Date.now() - _this2.serverActivity;
                      // We wait twice the TTL to be flexible on window's setInterval calls
                      if (delta > _ttl * 2) {
                          _this2.debug('did not receive server activity for the last ' + delta + 'ms');
                          _this2.ws.close();
                      }
                  }, _ttl);
              }
          }

          // parse the arguments number and type to find the headers, connectCallback and
          // (eventually undefined) errorCallback

      }, {
          key: '_parseConnect',
          value: function _parseConnect() {
              var headers = {},
                  connectCallback = void 0,
                  errorCallback = void 0;

              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
              }

              switch (args.length) {
                  case 2:
                      headers = args[0];
                      connectCallback = args[1];

                      break;
                  case 3:
                      if (args[1] instanceof Function) {
                          headers = args[0];
                          connectCallback = args[1];
                          errorCallback = args[2];
                      } else {
                          headers.login = args[0];
                          headers.passcode = args[1];
                          connectCallback = args[2];
                      }
                      break;
                  case 4:
                      headers.login = args[0];
                      headers.passcode = args[1];
                      connectCallback = args[2];
                      errorCallback = args[3];

                      break;
                  default:
                      headers.login = args[0];
                      headers.passcode = args[1];
                      connectCallback = args[2];
                      errorCallback = args[3];
                      headers.host = args[4];

              }

              return [headers, connectCallback, errorCallback];
          }
      }]);
      return Client;
  }();

  // The `webstomp` Object
  var webstomp = {
      Frame: Frame,
      VERSIONS: VERSIONS,
      // This method creates a WebSocket client that is connected to
      // the STOMP server located at the url.
      client: function client(url) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var ws = new WebSocket(url, options.protocols || VERSIONS.supportedProtocols());
          return new Client(ws, options);
      },

      // This method is an alternative to `webstomp.client()` to let the user
      // specify the WebSocket to use (either a standard HTML5 WebSocket or
      // a similar object).
      over: function over() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
          }

          return new (Function.prototype.bind.apply(Client, [null].concat(args)))();
      }
  };

  return webstomp;

})));
});

const webstomp$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': webstomp,
    __moduleExports: webstomp
});

const SCHEMA$5 = {
    "target": {
        "@id": C.target,
        "@type": "@id",
    },
};
const EventMessage = {
    SCHEMA: SCHEMA$5,
    is(value) {
        return Resource.is(value)
            && value.hasOwnProperty("target");
    },
};

const DEFAULT_OPTIONS = {
    maxReconnectAttempts: 10,
    reconnectDelay: 1000,
};
class MessagingService {
    constructor(context) {
        this.context = context;
        this._options = DEFAULT_OPTIONS;
        this._attempts = 0;
        this._subscriptionsQueue = [];
    }
    setOptions(options) {
        this._options = Object.assign({}, DEFAULT_OPTIONS, options);
    }
    connect(onConnect, onError) {
        if (this._client) {
            const error = new IllegalStateError(`The messaging service is already connect${this._client.connected ? "ed" : "ing"}.`);
            if (onError)
                onError(error);
            throw error;
        }
        if (this._subscriptionsMap)
            this._subscriptionsMap.clear();
        this.reconnect(onConnect, onError);
    }
    reconnect(onConnect, onError = this.__broadcastError.bind(this)) {
        if (!this._client)
            this._attempts = 0;
        else if (this._client.connected)
            this._client.disconnect();
        if (!this._subscriptionsMap)
            this._subscriptionsMap = new Map();
        const sock = new entry(this.context.resolve("/broker"));
        this._client = undefined(sock, {
            debug: false,
            heartbeat: false,
        });
        this._client.connect({}, () => {
            this._subscriptionsQueue.forEach(callback => callback());
            this._subscriptionsQueue.length = 0;
            this._attempts = 0;
            if (onConnect)
                onConnect();
        }, (errorFrameOrEvent) => {
            const canReconnect = this._options.maxReconnectAttempts === null || this._options.maxReconnectAttempts >= this._attempts;
            let errorMessage;
            if ("reason" in errorFrameOrEvent) {
                if (canReconnect) {
                    if (++this._attempts === 1)
                        this.__saveSubscriptions();
                    setTimeout(() => this.reconnect(onConnect, onError), this._options.reconnectDelay);
                    return;
                }
                this._client = undefined;
                this._subscriptionsQueue.length = 0;
                errorMessage = `CloseEventError: ${errorFrameOrEvent.reason}`;
            }
            else if ("body" in errorFrameOrEvent) {
                if (!this._client || !this._client.connected && canReconnect)
                    return;
                errorMessage = `${errorFrameOrEvent.headers["message"]}: ${errorFrameOrEvent.body.trim()}`;
            }
            else {
                errorMessage = `Unknown error: ${errorFrameOrEvent}`;
            }
            onError(new Error(errorMessage));
        });
    }
    subscribe(destination, onEvent, onError) {
        if (!this._client)
            this.connect();
        if (!this._subscriptionsMap.has(destination))
            this._subscriptionsMap.set(destination, new Map());
        const callbacksMap = this._subscriptionsMap.get(destination);
        if (callbacksMap.has(onEvent))
            return;
        const subscriptionID = UUIDUtils.generate();
        callbacksMap.set(onEvent, {
            id: subscriptionID,
            errorCallback: onError,
        });
        const subscribeTo = this.__makeSubscription(subscriptionID, destination, onEvent, onError);
        if (this._client.connected)
            return subscribeTo();
        this._subscriptionsQueue.push(subscribeTo);
    }
    unsubscribe(destination, onEvent) {
        if (!this._client || !this._subscriptionsMap || !this._subscriptionsMap.has(destination))
            return;
        const callbackMap = this._subscriptionsMap.get(destination);
        if (!callbackMap.has(onEvent))
            return;
        const subscriptionID = callbackMap.get(onEvent).id;
        callbackMap.delete(onEvent);
        if (callbackMap.size === 0)
            this._subscriptionsMap.delete(destination);
        this._client.unsubscribe(subscriptionID);
    }
    __broadcastError(error) {
        if (!this._subscriptionsMap)
            return;
        this._subscriptionsMap
            .forEach(callbacksMap => callbacksMap
            .forEach(subscription => {
            if (!subscription.errorCallback)
                return;
            subscription.errorCallback(error);
        }));
    }
    __makeSubscription(id, destination, eventCallback, errorCallback) {
        return () => this._client.subscribe(destination, message => {
            new JSONLDParser()
                .parse(message.body)
                .then((data) => {
                const nodes = RDFDocument.getResources(data);
                const freeResources = FreeResources
                    .parseFreeNodes(this.context.registry, nodes);
                const eventMessage = freeResources
                    .getPointers(true)
                    .find(EventMessage.is);
                if (!eventMessage)
                    throw new Error("No message was returned by the notification.");
                return eventMessage;
            })
                .then(eventCallback)
                .catch(errorCallback);
        }, { id });
    }
    __saveSubscriptions() {
        if (this._subscriptionsQueue.length || !this._subscriptionsMap)
            return;
        this._subscriptionsMap.forEach((callbackMap, destination) => callbackMap.forEach((subscription, eventCallback) => {
            const subscribeTo = this.__makeSubscription(subscription.id, destination, eventCallback, subscription.errorCallback);
            this._subscriptionsQueue.push(subscribeTo);
        }));
    }
}

const SCHEMA$6 = {
    "relatedDocument": {
        "@id": C.relatedDocument,
        "@type": "@id",
    },
    "bNodesMap": {
        "@id": C.bNodesMap,
        "@type": "@id",
    },
};
const DocumentMetadata = {
    TYPE: C.DocumentMetadata,
    SCHEMA: SCHEMA$6,
};

const SCHEMA$7 = {
    "errorCode": {
        "@id": C.errorCode,
        "@type": XSD.string,
    },
    "errorMessage": {
        "@id": C.errorMessage,
        "@language": "en",
    },
    "errorParameters": {
        "@id": C.errorParameters,
        "@type": "@id",
    },
};
const Error$1 = {
    TYPE: C.Error,
    SCHEMA: SCHEMA$7,
};

const SCHEMA$8 = {
    "entries": {
        "@id": C.entry,
        "@type": "@id",
        "@container": "@set",
    },
};
const Map$1 = {
    TYPE: C.Map,
    SCHEMA: SCHEMA$8,
    is(object) {
        return Resource.is(object)
            && object.$hasType(Map$1.TYPE)
            && object.hasOwnProperty("entries");
    },
};

const SCHEMA$9 = {
    "entryKey": {
        "@id": C.entryKey,
    },
    "entryValue": {
        "@id": C.entryValue,
    },
};
const MapEntry = {
    SCHEMA: SCHEMA$9,
};

const SCHEMA$a = {
    "errorDetails": {
        "@id": C.errorDetails,
        "@type": "@id",
    },
};
const ValidationError = {
    TYPE: C.ValidationError,
    SCHEMA: SCHEMA$a,
};

const TYPE = C.ChildCreatedEvent;
const SCHEMA$b = Object.assign({}, EventMessage.SCHEMA, { "details": {
        "@id": C.details,
        "@type": "@id",
    } });
const ChildCreatedEvent = {
    TYPE,
    SCHEMA: SCHEMA$b,
};

const SCHEMA$c = {
    "createdDocuments": {
        "@id": C.createdDocument,
        "@type": "@id",
        "@container": "@set",
    },
};
const DocumentCreatedEventDetails = {
    TYPE: C.DocumentCreatedEventDetails,
    SCHEMA: SCHEMA$c,
};

const TYPE$1 = C.DocumentDeletedEvent;
const SCHEMA$d = EventMessage.SCHEMA;
const DocumentDeletedEvent = {
    TYPE: TYPE$1,
    SCHEMA: SCHEMA$d,
};

const TYPE$2 = C.DocumentModifiedEvent;
const SCHEMA$e = EventMessage.SCHEMA;
const DocumentModifiedEvent = {
    TYPE: TYPE$2,
    SCHEMA: SCHEMA$e,
};

const TYPE$3 = C.MemberAddedEvent;
const SCHEMA$f = Object.assign({}, EventMessage.SCHEMA, { "details": {
        "@id": C.details,
        "@type": "@id",
    } });
const MemberAddedEvent = {
    TYPE: TYPE$3,
    SCHEMA: SCHEMA$f,
};

const SCHEMA$g = {
    "members": {
        "@id": C.member,
        "@type": "@id",
        "@container": "@set",
    },
};
const MemberEventDetails = {
    SCHEMA: SCHEMA$g,
};

const TYPE$4 = C.MemberAddedEventDetails;
const SCHEMA$h = MemberEventDetails.SCHEMA;
const MemberAddedEventDetails = {
    TYPE: TYPE$4,
    SCHEMA: SCHEMA$h,
};

const TYPE$5 = C.MemberRemovedEvent;
const SCHEMA$i = Object.assign({}, EventMessage.SCHEMA, { "details": {
        "@id": C.details,
        "@type": "@id",
    } });
const MemberRemovedEvent = {
    TYPE: TYPE$5,
    SCHEMA: SCHEMA$i,
};

const TYPE$6 = C.MemberRemovedEventDetails;
const SCHEMA$j = MemberEventDetails.SCHEMA;
const MemberRemovedEventDetails = {
    TYPE: TYPE$6,
    SCHEMA: SCHEMA$j,
};

const SHACL = {
    namespace: "http://www.w3.org/ns/shacl#",
    ValidationReport: "http://www.w3.org/ns/shacl#ValidationReport",
    ValidationResult: "http://www.w3.org/ns/shacl#ValidationResult",
    conforms: "http://www.w3.org/ns/shacl#conforms",
    detail: "http://www.w3.org/ns/shacl#detail",
    focusNode: "http://www.w3.org/ns/shacl#focusNode",
    result: "http://www.w3.org/ns/shacl#result",
    resultMessage: "http://www.w3.org/ns/shacl#resultMessage",
    resultPath: "http://www.w3.org/ns/shacl#resultPath",
    resultSeverity: "http://www.w3.org/ns/shacl#resultSeverity",
    shapesGraphWellFormed: "http://www.w3.org/ns/shacl#shapesGraphWellFormed",
    sourceConstraintComponent: "http://www.w3.org/ns/shacl#sourceConstraintComponent",
    sourceShape: "http://www.w3.org/ns/shacl#sourceShape",
    value: "http://www.w3.org/ns/shacl#value",
};

const SCHEMA$k = {
    "conforms": {
        "@id": SHACL.conforms,
        "@type": XSD.boolean,
    },
    "results": {
        "@id": SHACL.result,
        "@type": "@id",
        "@container": "@set",
    },
    "shapesGraphWellFormed": {
        "@id": SHACL.shapesGraphWellFormed,
        "@type": XSD.boolean,
    },
};
const ValidationReport = {
    TYPE: SHACL.ValidationReport,
    SCHEMA: SCHEMA$k,
};

const SCHEMA$l = {
    "focusNode": {
        "@id": SHACL.focusNode,
        "@type": "@id",
    },
    "resultPath": {
        "@id": SHACL.resultPath,
        "@type": "@id",
    },
    "value": {
        "@id": SHACL.value,
    },
    "sourceShape": {
        "@id": SHACL.sourceShape,
        "@type": "@id",
    },
    "sourceConstraintComponent": {
        "@id": SHACL.sourceConstraintComponent,
        "@type": "@id",
    },
    "detail": {
        "@id": SHACL.detail,
        "@type": "@id",
    },
    "resultMessage": {
        "@id": SHACL.resultMessage,
        "@type": XSD.string,
    },
    "resultSeverity": {
        "@id": SHACL.resultSeverity,
        "@type": "@id",
    },
};
const ValidationResult = {
    TYPE: SHACL.ValidationResult,
    SCHEMA: SCHEMA$l,
};

const SCHEMA$m = {
    "buildDate": {
        "@id": C.buildDate,
        "@type": XSD.dateTime,
    },
    "version": {
        "@id": C.version,
        "@type": XSD.string,
    },
};
const PlatformInstance = {
    TYPE: C.PlatformInstance,
    SCHEMA: SCHEMA$m,
};

const SCHEMA$n = {
    "instance": {
        "@id": C.instance,
        "@type": "@id",
    },
};
const PlatformMetadata = {
    TYPE: C.Platform,
    SCHEMA: SCHEMA$n,
};

class GlobalContext extends AbstractContext {
    constructor() {
        super(undefined);
        this._baseURI = "";
        this._generalObjectSchema = new DigestedObjectSchema();
        this.registry = GeneralRegistry.createFrom({ context: this, __modelDecorator: RegisteredPointer });
        this.__registerDefaultObjectSchemas();
        this.__registerDefaultDecorators();
    }
    __registerDefaultObjectSchemas() {
        this
            .extendObjectSchema(Document)
            .extendObjectSchema(PlatformMetadata)
            .extendObjectSchema(PlatformInstance)
            .extendObjectSchema(AddMemberAction)
            .extendObjectSchema(RemoveMemberAction)
            .extendObjectSchema(Error$1)
            .extendObjectSchema(Map$1)
            .extendObjectSchema(MapEntry.SCHEMA)
            .extendObjectSchema(DocumentMetadata)
            .extendObjectSchema(ErrorResponse)
            .extendObjectSchema(ResponseMetadata)
            .extendObjectSchema(ValidationError)
            .extendObjectSchema(ValidationReport)
            .extendObjectSchema(ValidationResult)
            .extendObjectSchema(QueryMetadata)
            .extendObjectSchema(ChildCreatedEvent)
            .extendObjectSchema(DocumentCreatedEventDetails)
            .extendObjectSchema(DocumentDeletedEvent)
            .extendObjectSchema(DocumentModifiedEvent)
            .extendObjectSchema(MemberAddedEvent)
            .extendObjectSchema(MemberAddedEventDetails)
            .extendObjectSchema(MemberRemovedEvent)
            .extendObjectSchema(MemberRemovedEventDetails);
    }
    __registerDefaultDecorators() {
    }
}
GlobalContext.instance = new GlobalContext();

class DocumentsContext extends AbstractContext {
    static __mergePaths(target, source) {
        if (!source)
            return target;
        if (!target)
            return ObjectUtils.clone(source, { objects: true });
        for (const key of Object.keys(source)) {
            const sourcePath = source[key];
            if (sourcePath === null) {
                delete target[key];
                continue;
            }
            const targetPath = target[key];
            if (!targetPath) {
                target[key] = isObject(sourcePath) ?
                    ObjectUtils.clone(sourcePath, { objects: true }) :
                    sourcePath;
                continue;
            }
            if (isString(sourcePath)) {
                if (isObject(targetPath)) {
                    targetPath.slug = sourcePath;
                }
                else {
                    target[key] = sourcePath;
                }
                continue;
            }
            if (sourcePath.slug === void 0 && sourcePath.paths === void 0)
                continue;
            const targetDocPaths = isString(targetPath) ?
                target[key] = { slug: targetPath } : targetPath;
            if (sourcePath.slug !== void 0)
                targetDocPaths.slug = sourcePath.slug;
            if (sourcePath.paths !== void 0)
                targetDocPaths.paths = DocumentsContext.__mergePaths(targetDocPaths.paths, sourcePath.paths);
        }
        return target;
    }
    constructor(url) {
        super(GlobalContext.instance);
        this._baseURI = url;
        this.registry = DocumentsRegistry.createFrom({ context: this });
        this.repository = DocumentsRepository.createFrom({ context: this });
        this.messaging = new MessagingService(this);
    }
    _resolvePath(path) {
        const leftSearchedPaths = path.split(".");
        const currentSearchedPaths = [];
        let url = "";
        let documentPaths = this._settings && this._settings.paths;
        while (leftSearchedPaths.length) {
            const containerKey = leftSearchedPaths.shift();
            currentSearchedPaths.push(containerKey);
            const containerPath = documentPaths ? documentPaths[containerKey] : null;
            if (!containerPath)
                throw new IllegalStateError(`The path "${currentSearchedPaths.join(".")}" hasn't been declared.`);
            const slug = isString(containerPath) ? containerPath : containerPath.slug;
            if (!slug)
                throw new IllegalStateError(`The path "${currentSearchedPaths.join(".")}" doesn't have a slug set.`);
            url = URI.resolve(url, slug);
            documentPaths = isObject(containerPath) ? containerPath.paths : undefined;
        }
        return this.resolve(url);
    }
    _extendPaths(paths) {
        this._settings.paths = DocumentsContext.__mergePaths(this._settings.paths, paths);
    }
    _extendsSettings(settings) {
        this._extendPaths(settings.paths);
        delete settings.paths;
        ObjectUtils.extend(this._settings, settings);
    }
}



const Errors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AbstractError: AbstractError,
    IDAlreadyInUseError: IDAlreadyInUseError,
    IllegalActionError: IllegalActionError,
    IllegalArgumentError: IllegalArgumentError,
    IllegalStateError: IllegalStateError,
    InvalidJSONLDSyntaxError: InvalidJSONLDSyntaxError,
    NotImplementedError: NotImplementedError
});

var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["CONTINUE"] = 100] = "CONTINUE";
    StatusCode[StatusCode["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    StatusCode[StatusCode["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    StatusCode[StatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCode[StatusCode["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    StatusCode[StatusCode["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    StatusCode[StatusCode["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    StatusCode[StatusCode["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    StatusCode[StatusCode["FOUND"] = 302] = "FOUND";
    StatusCode[StatusCode["SEE_OTHER"] = 303] = "SEE_OTHER";
    StatusCode[StatusCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    StatusCode[StatusCode["USE_PROXY"] = 305] = "USE_PROXY";
    StatusCode[StatusCode["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    StatusCode[StatusCode["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    StatusCode[StatusCode["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    StatusCode[StatusCode["REQUEST_TIME_OUT"] = 408] = "REQUEST_TIME_OUT";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
    StatusCode[StatusCode["GONE"] = 410] = "GONE";
    StatusCode[StatusCode["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    StatusCode[StatusCode["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    StatusCode[StatusCode["REQUEST_ENTITY_TOO_LARGE"] = 413] = "REQUEST_ENTITY_TOO_LARGE";
    StatusCode[StatusCode["REQUEST_URI_TOO_LARGE"] = 414] = "REQUEST_URI_TOO_LARGE";
    StatusCode[StatusCode["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    StatusCode[StatusCode["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    StatusCode[StatusCode["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    StatusCode[StatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    StatusCode[StatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    StatusCode[StatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    StatusCode[StatusCode["GATEWAY_TIME_OUT"] = 504] = "GATEWAY_TIME_OUT";
    StatusCode[StatusCode["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
})(StatusCode || (StatusCode = {}));



const HTTP = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Errors: index$1,
    Header: Header,
    get HTTPMethod () { return HTTPMethod; },
    JSONParser: JSONParser,
    RequestService: RequestService,
    RequestUtils: RequestUtils,
    Response: Response,
    get StatusCode () { return StatusCode; },
    StringParser: StringParser
});



const JSONLD = /*#__PURE__*/Object.freeze({
    __proto__: null,
    JSONLDConverter: JSONLDConverter,
    JSONLDParser: JSONLDParser,
    JSONLDProcessor: JSONLDProcessor,
    _guessXSDType: _guessXSDType
});

const DirectContainer = {
    TYPE: TransientDirectContainer.TYPE,
    is: (value) => TransientDirectContainer.is(value)
        && Document.is(value),
    create: TransientDirectContainer.create,
    createFrom: TransientDirectContainer.createFrom,
};



const LDP$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AddMemberAction: AddMemberAction,
    Error: Error$1,
    Map: Map$1,
    MapEntry: MapEntry,
    DirectContainer: DirectContainer,
    TransientDirectContainer: TransientDirectContainer,
    DocumentMetadata: DocumentMetadata,
    ErrorResponse: ErrorResponse,
    RemoveMemberAction: RemoveMemberAction,
    ResponseMetadata: ResponseMetadata,
    ValidationError: ValidationError,
    VolatileResource: VolatileResource
});



const LDPatch = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DeltaCreator: DeltaCreator,
    LDPatchToken: LDPatchToken,
    PrefixToken: PrefixToken$1,
    AddToken: AddToken,
    DeleteToken: DeleteToken,
    UpdateListToken: UpdateListToken,
    SliceToken: SliceToken
});



const Messaging = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ChildCreatedEvent: ChildCreatedEvent,
    DocumentCreatedEventDetails: DocumentCreatedEventDetails,
    DocumentDeletedEvent: DocumentDeletedEvent,
    DocumentModifiedEvent: DocumentModifiedEvent,
    get Event () { return Event; },
    EventMessage: EventMessage,
    MemberAddedEvent: MemberAddedEvent,
    MemberAddedEventDetails: MemberAddedEventDetails,
    MemberEventDetails: MemberEventDetails,
    MemberRemovedEvent: MemberRemovedEvent,
    MemberRemovedEventDetails: MemberRemovedEventDetails,
    MessagingService: MessagingService,
    _validateEventType: _validateEventType,
    _parseURIPattern: _parseURIPattern,
    _createDestination: _createDestination
});



const RDF = /*#__PURE__*/Object.freeze({
    __proto__: null,
    RDFDocument: RDFDocument,
    RDFList: RDFList,
    Serializers: index,
    RDFLiteral: RDFLiteral,
    RDFNode: RDFNode,
    URI: URI,
    RDFValue: RDFValue
});



const SHACL$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ValidationReport: ValidationReport,
    ValidationResult: ValidationResult
});



const SPARQL = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SPARQLService: SPARQLService,
    SPARQLBuilder: SPARQLBuilder,
    SPARQLRawResultsParser: SPARQLRawResultsParser
});



const System = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PlatformMetadata: PlatformMetadata,
    PlatformInstance: PlatformInstance
});

const RDF$1 = {
    namespace: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
};



const Vocabularies = /*#__PURE__*/Object.freeze({
    __proto__: null,
    C: C,
    LDP: LDP,
    RDF: RDF$1,
    SHACL: SHACL,
    XSD: XSD
});

class CarbonLDP extends DocumentsContext {
    constructor(urlOrSettings) {
        super(__getURLFrom(urlOrSettings));
        this._settings = {
            vocabulary: "vocabularies/main/#",
            paths: {
                system: {
                    slug: ".system/",
                    paths: {
                        platform: "platform/",
                        credentials: "credentials/",
                        roles: "roles/",
                    },
                },
                users: {
                    slug: "users/",
                    paths: {
                        me: "me/",
                    },
                },
            },
        };
        this._extendsSettings(__getSettingsFrom(urlOrSettings));
        this.documents = this.registry.getPointer(this._baseURI, true);
    }
    static get version() { return "5.2.0"; }
    get version() { return CarbonLDP.version; }
    getPlatformMetadata() {
        return promiseMethod(() => {
            const uri = this._resolvePath("system.platform");
            return this.documents.$get(uri);
        });
    }
}
CarbonLDP.AbstractContext = AbstractContext;
CarbonLDP.AccessPoint = AccessPoint;
CarbonLDP.TransientAccessPoint = TransientAccessPoint;
CarbonLDP.Errors = Errors;
CarbonLDP.FreeResources = FreeResources;
CarbonLDP.HTTP = HTTP;
CarbonLDP.JSONLD = JSONLD;
CarbonLDP.LDP = LDP$1;
CarbonLDP.LDPatch = LDPatch;
CarbonLDP.Messaging = Messaging;
CarbonLDP.Vocabularies = Vocabularies;
CarbonLDP.ObjectSchemaUtils = ObjectSchemaUtils;
CarbonLDP.ObjectSchemaDigester = ObjectSchemaDigester;
CarbonLDP.DigestedObjectSchemaProperty = DigestedObjectSchemaProperty;
CarbonLDP.PointerType = PointerType;
CarbonLDP.ContainerType = ContainerType;
CarbonLDP.DigestedObjectSchema = DigestedObjectSchema;
CarbonLDP.Document = Document;
CarbonLDP.Fragment = Fragment;
CarbonLDP.TransientFragment = TransientFragment;
CarbonLDP.Pointer = Pointer;
CarbonLDP.RDF = RDF;
CarbonLDP.Resource = Resource;
CarbonLDP.GlobalContext = GlobalContext;
CarbonLDP.SHACL = SHACL$1;
CarbonLDP.SPARQL = SPARQL;
CarbonLDP.System = System;
CarbonLDP.Utils = Utils;
function __getURLFrom(urlOrSettings) {
    return isString(urlOrSettings) ?
        __getURLFromString(urlOrSettings) :
        __getURLFromSettings(urlOrSettings);
}
function __getURLFromString(url) {
    if (!URI.hasProtocol(url))
        throw new IllegalArgumentError(`The URL must contain a valid protocol: "http://", "https://".`);
    if (url.endsWith("/"))
        return url;
    return url + "/";
}
function __getURLFromSettings(settings) {
    if (!isString(settings.host))
        throw new IllegalArgumentError(`The settings object must contains a valid host string.`);
    if (hasProtocol(settings.host))
        throw new IllegalArgumentError(`The host must not contain a protocol.`);
    if (settings.host.includes(":"))
        throw new IllegalArgumentError(`The host must not contain a port.`);
    const protocol = settings.ssl === false ? "http://" : "https://";
    const host = settings.host.endsWith("/") ? settings.host.slice(0, -1) : settings.host;
    const url = `${protocol}${host}/`;
    if (!isNumber(settings.port))
        return url;
    return url.slice(0, -1) + `:${settings.port}/`;
}
function __getSettingsFrom(urlOrSettings) {
    if (isString(urlOrSettings))
        return {};
    return Object.assign({}, urlOrSettings, { ssl: null, host: null, port: null });
}

/*export default function init() {
  const carbonldp = new CarbonLDP("https://data-itesm.lab.base22.com/");
  carbonldp.documents.$getChildren("genres/").then((response) => {
    console.log(response);
    const genresDiv = document.querySelector("#genres");
    response.forEach((genre) => {
      const p = document.createElement("p");
      p.appendChild(document.createTextNode(genre.originalValue));
      genresDiv.appendChild(p);
    });
  });
}*/
function init$1() {
  const carbonldp = new CarbonLDP("https://data-itesm.lab.base22.com/");
  const destin = document.querySelector("#genres");
  const genresDiv = document.createElement("div");
  destin.appendChild(genresDiv);
  const ul = document.createElement("ul");
  genresDiv.appendChild(ul);

    carbonldp.documents.$executeSELECTQuery(
        `
        SELECT ?keywordLabel (COUNT (?Movie) AS ?movieCount)
    WHERE {
      ?keyword a <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Keyword> .
      ?keyword <http://www.w3.org/2000/01/rdf-schema#label> ?keywordLabel .
      ?keyword ?Movie ?object .
    } GROUP BY ?keywordLabel
      `
    ).then((response) => {
        console.log("Raw SPARQL query result");
        //console.log(response);
        return response
          .bindings
          .map(function(binding){
            const lis = document.createElement("li");
        lis.innerHTML = `<a href="#" data-weight=` + binding["movieCount"]+ `>` + binding["keywordLabel"] + `</a>`;
        ul.appendChild(lis);
          }
        );

    });
}

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isLoading = true;
    }
    loadCarbon() {
        const tagCanvasScript = document.createElement("script");
        tagCanvasScript.onload = () => { this.isLoading = false; };
        tagCanvasScript.src = "carbonldp.js";
        this.el.appendChild(tagCanvasScript);
        console.log("CarbonLDP");
    }
    render() {
        return (init$1());
        h$1("div", { id: "tags" });
        ;
    }
    get el() { return getElement(this); }
    static get style() { return "body {\n  background: #08454a;\n  font-family: \'Open Sans\', sans-serif;\n}\n\n#myCanvasContainer {\n  background: #000000;\n  width: 1000px;\n  height: 300px;\n  border-radius: 10px;\n}\nul {\n  display: none;\n}\n\n#tags {\n  color: white;\n  font-family: \'Roboto\';\n}"; }
};

export { MyComponent as data_cloud };
