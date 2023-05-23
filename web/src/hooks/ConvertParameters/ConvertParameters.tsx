/**
 * @file ConvertParameters.tsx
 * 
 * @module Hooks/ConvertParameters
 * 
 * @description
 * Provides functions to convert parameters to and from strings.
 */
import { Image, RigFamily } from '../../models/Parameters'

/**

Converts a string of image URLs separated by semicolons into an array of Image objects.

@param url - A string of image URLs separated by semicolons. 

@param name - A string of image names separated by semicolons.

@param description - A string of image descriptions separated by semicolons.

@returns {Image[]} An array of Image objects.
*/
export function imagesToArray(url: string | null, name: string | null, description: string | null) {
    var images: Image[] = [];
    if (url === null) {
        return images;
    }
    if (name === null) {
        name = "";
    }
    if (description === null) {
        description = "";
    }
    if (url.includes(";") === false) {
        const image: Image = {
            image_url: url,
            image_name: name,
            image_description: description
        };
        images.push(image);
        return images;
    }
    url.split(";").map((url, index) => {
        const image: Image = {
            image_url: url,
            image_name: null,
            image_description: null
        };
        if (name === null) {
            name = "";
        }
        const names = name.split(";");
        if (names.length > index) {
            image.image_name = names[index];
        }
        if (description === null) {
            description = "";
        }
        const descriptions = description.split(";");
        if (descriptions.length > index) {
            image.image_description = descriptions[index];
        }
        images.push(image);
    });

    return images;
}

/**

Converts an array of Image objects to a string of concatenated image URLs, names and descriptions.
@param images - An array of Image objects
@returns An object containing concatenated URL, name and description strings.
@example
const images = [
{ image_url: "https://example.com/image1.jpg", image_name: "Image 1", image_description: "This is image 1" },
{ image_url: "https://example.com/image2.jpg", image_name: "Image 2", image_description: "This is image 2" }
];
const { url, name, description } = imagesToString(images);
console.log(url); // "https://example.com/image1.jpg;https://example.com/image2.jpg"
console.log(name); // "Image 1;Image 2"
console.log(description); // "This is image 1;This is image 2"
*/
export function imagesToString(images: Image[]) {
    var url = "";
    var name = "";
    var description = "";
    images.map((image, index) => {
        if (index > 0) {
            url += ";";
            name += ";";
            description += ";";
        }
        url += image.image_url;
        if (image.image_name !== null) {
            name += image.image_name;
        }
        if (image.image_description !== null) {
            description += image.image_description;
        }
    }
    );
    return { url, name, description };
}

/**
 * Converts a string containing one or multiple rig family names and descriptions into an array of RigFamily objects.
 *
 * @param rigFamilyName - A string containing one or multiple rig family names separated by semicolons (;).
 * @param rigFamilyDescription - A string containing one or multiple rig family descriptions separated by semicolons (;). Optional.
 * @returns An array of RigFamily objects, where each object contains a name and an optional description.
 */
export function rigFamilyToArray(rigFamilyName: string, rigFamilyDescription: string) {
    var rigFamily: RigFamily[] = [];
    if (rigFamilyName.includes(";") === false) {
        const rigFamilyItem: RigFamily = {
            name: rigFamilyName,
            description: rigFamilyDescription
        };
        rigFamily.push(rigFamilyItem);
        return rigFamily;
    }
    rigFamilyName.split(";").map((rigFamilyName, index) => {
        const rigFamilyItem: RigFamily = {
            name: rigFamilyName,
            description: null
        };
        const descriptions = rigFamilyDescription.split(";");
        if (descriptions.length > index) {
            rigFamilyItem.description = descriptions[index];
        }
        rigFamily.push(rigFamilyItem);
    });
    return rigFamily;
}

/**
 * Converts a date string to a Date object.
 * @param dateString - A date string in ISO format.
 * @returns A Date object.
 * @example
 * const date = stringToDate("2020-01-01T00:00:00.000Z");
 * console.log(date); // 2020-01-01T00:00:00.000Z
 * @example
 * const date = stringToDate(null);
 * console.log(date); // null
 * @example
 * const date = stringToDate("");
 * console.log(date); // null
*/
export function stringToDate(dateString: string | null) {
    if (dateString === null || dateString === "") {
        return null;
    }
    const date = new Date(dateString);
    return date as Date;
}

/**
 * Converts a Date object to a string in ISO format.
 * @param date - A Date object.
 * @returns A date in ISO format.
 * @example
 * const date = new Date("2020-01-01T00:00:00.000Z");
 * const dateString = dateToString(date);
 * console.log(dateString); // 2020-01-01T00:00:00.000Z
*/
export function dateToString(date: Date) {
    const dateString = date.toISOString();
    return dateString;
}

export function possibleValuesToArray(value: string, description: string | null) {
    var values: any[] = [];
    if (value === null) {
        return values;
    }
    if (value.includes(";") === false) {
        const valueItem: any = {
            value: value,
            description: description
        };
        values.push(valueItem);
        return values;
    }
    value.split(";").map((value, index) => {
        const valueItem: any = {
            value: value,
            description: null
        };
        if (description !== null) {
            const descriptions = description.split(";");
            if (descriptions.length > index) {
                valueItem.description = descriptions[index];
            }
        }
        values.push(valueItem);
    });
    return values;
}