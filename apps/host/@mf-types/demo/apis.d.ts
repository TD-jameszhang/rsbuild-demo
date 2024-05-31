
    export type RemoteKeys = 'demo/Button';
    type PackageType<T> = T extends 'demo/Button' ? typeof import('demo/Button') :any;