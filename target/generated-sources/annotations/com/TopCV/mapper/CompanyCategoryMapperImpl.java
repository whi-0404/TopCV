package com.TopCV.mapper;

import com.TopCV.dto.request.CompanyCategoryRequest;
import com.TopCV.dto.response.CompanyCategoryResponse;
import com.TopCV.entity.CompanyCategory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-06T16:18:23+0700",
    comments = "version: 1.6.2, compiler: javac, environment: Java 23 (Oracle Corporation)"
)
@Component
public class CompanyCategoryMapperImpl implements CompanyCategoryMapper {

    @Override
    public CompanyCategory toEntity(CompanyCategoryRequest request) {
        if ( request == null ) {
            return null;
        }

        CompanyCategory.CompanyCategoryBuilder companyCategory = CompanyCategory.builder();

        companyCategory.name( request.getName() );

        return companyCategory.build();
    }

    @Override
    public CompanyCategoryResponse toResponse(CompanyCategory companyCategory) {
        if ( companyCategory == null ) {
            return null;
        }

        CompanyCategoryResponse.CompanyCategoryResponseBuilder companyCategoryResponse = CompanyCategoryResponse.builder();

        companyCategoryResponse.id( companyCategory.getId() );
        companyCategoryResponse.name( companyCategory.getName() );

        return companyCategoryResponse.build();
    }

    @Override
    public void updateEntity(CompanyCategory category, CompanyCategoryRequest request) {
        if ( request == null ) {
            return;
        }

        category.setName( request.getName() );
    }
}
