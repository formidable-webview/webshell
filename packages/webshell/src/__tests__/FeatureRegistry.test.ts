import FeatureRegistry from '../FeatureRegistry';
import FeatureBuilder from '../FeatureBuilder';
import Reporter from '../Reporter';

function buildFeature(id: string) {
  return new FeatureBuilder({
    defaultOptions: {},
    identifier: id,
    script: ''
  });
}

describe('FeatureRegistry', () => {
  it('should throw when props are duplicated between distinct features', () => {
    const features = [
      new (buildFeature('feat1').withShellHandler('onWebDoThis').build())(),
      new (buildFeature('feat2').withShellHandler('onWebDoThis').build())()
    ];
    expect(
      () => new FeatureRegistry(features, new Reporter(true, true))
    ).toThrow();
  });
});
