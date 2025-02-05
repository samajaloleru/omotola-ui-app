import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { config } from './config';

export const client = createClient({
    projectId: config.sanity.projectId,
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2023-06-15',
    token: config.sanity.token,
    ignoreBrowserTokenWarning: true
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);