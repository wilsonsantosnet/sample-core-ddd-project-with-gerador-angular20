using Microsoft.EntityFrameworkCore;
using Seed.Data.Map;
using Seed.Domain.Entitys;

namespace Seed.Data.Context
{
    public class DbContextSeed : DbContext
    {

        public DbContextSeed(DbContextOptions<DbContextSeed> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            new SampleMap(modelBuilder.Entity<Sample>());
            new SampleTypeMap(modelBuilder.Entity<SampleType>());

        }


    }
}
