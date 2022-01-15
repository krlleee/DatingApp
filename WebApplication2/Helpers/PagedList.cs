using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication2.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PagedList(List<T> items,int count,int pageNumber,int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            //koliko stranica pravimo u zavisnosti od broja usera i kolicine koje zelimo da predstavimo na jednoj stranici
            //npr imamo 13 usera i zelimo 5 da prikazujemo ceiling vraca 13/5 odnosono 3 str treba da napravimo
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            this.AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber,int pageSize)
        {
            var count = await source.CountAsync();
            //delimo po stranicama ako je npr pagenumber 1 a pagesize 5, (1-1)*5=0 i onda take(5) znaci za prvu stanicu uzimamo prvih 5 usera
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
