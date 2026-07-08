import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(product: any) {
    return this.elasticsearchService.index({
      index: 'products', 
      id: product.id.toString(),
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
      },
    });
  }


  async searchProducts(text: string) {
    const result = await this.elasticsearchService.search({
      index: 'products',
      query: {
        multi_match: {
          query: text,
          fields: ['name^2', 'description'], 
          fuzziness: 'AUTO', 
      },
    }
    });


    return result.hits.hits.map((hit) => hit._source);
  }
}