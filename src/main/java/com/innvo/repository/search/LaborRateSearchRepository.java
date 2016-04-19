package com.innvo.repository.search;

import com.innvo.domain.LaborRate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the LaborRate entity.
 */
public interface LaborRateSearchRepository extends ElasticsearchRepository<LaborRate, Long> {
}
