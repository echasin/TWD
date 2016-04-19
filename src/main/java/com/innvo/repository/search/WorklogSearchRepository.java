package com.innvo.repository.search;

import com.innvo.domain.Worklog;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Worklog entity.
 */
public interface WorklogSearchRepository extends ElasticsearchRepository<Worklog, Long> {
}
