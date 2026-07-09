import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE') || 'http://localhost:9200',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService],
  exports: [SearchService], 
})
export class SearchModule {}