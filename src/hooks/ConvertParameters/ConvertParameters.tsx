import { Image } from '../../models/Parameters'

export function imagesToArray(url: string, name: string, description: string) {
    var images: Image[] = [];
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
        const names = name.split(";");
        if (names.length > index) {
            image.image_name = names[index];
        }
        const descriptions = description.split(";");
        if (descriptions.length > index) {
            image.image_description = descriptions[index];
        }
        images.push(image);
    });

    return images;
}

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