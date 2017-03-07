import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLID,
} from 'graphql';

import galaxyInputType from '../types/galaxy-input';
import galaxyType from '../types/galaxy';
import getProjection from '../get-projection';
import GalaxyModel from '../../models/galaxy';

export default {
  addGalaxy: {
    type: GraphQLBoolean,
    args: {
      data: {
        name: 'data',
        type: new GraphQLNonNull(galaxyInputType)
      }
    },
    async resolve(root, params, context, options) {
      const galaxyModel = new GalaxyModel(params.data);
      const newGalaxy = await galaxyModel.save();

      if (!newGalaxy) {
        throw new Error('Error adding new galaxy');
      }
      return true;
    }
  },
  removeGalaxy: {
    type: galaxyType,
    args: {
      _id: {
        name: '_id',
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    async resolve(root, params, context, options) {
      const projection = getProjection(options.fieldNodes[0]);
      const removedGalaxy = await GalaxyModel
        .findByIdAndRemove(params._id, {
          select: projection
        })
        .exec();

      if (!removedGalaxy) {
        throw new Error('Error removing galaxy');
      }

      return removedGalaxy;
    }
  },
};