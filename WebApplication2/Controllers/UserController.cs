using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApplication2.Data;
using WebApplication2.Dtos;

namespace WebApplication2.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            foreach (var u in usersToReturn)
            {
                foreach (var us in users)
                {
                    if (us.Id == u.Id)
                    {
                        if (DateTime.Now.Month > us.DateOfBirth.Month)
                        {

                            u.Age = DateTime.Now.Year - us.DateOfBirth.Year;
                        }
                        else
                        {
                            if (DateTime.Now.Day > us.DateOfBirth.Day)
                            {
                                u.Age = DateTime.Now.Year - us.DateOfBirth.Year;
                            }
                            else
                            {
                                u.Age = DateTime.Now.Year - us.DateOfBirth.Year - 1;
                            }
                        }

                    }

                }
            }

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            if (DateTime.Now.Month > user.DateOfBirth.Month)
            {

                userToReturn.Age = DateTime.Now.Year - user.DateOfBirth.Year;
            }
            else
            {
                if (DateTime.Now.Day > user.DateOfBirth.Day)
                {
                    userToReturn.Age = DateTime.Now.Year - user.DateOfBirth.Year;
                }
                else
                {
                    userToReturn.Age = DateTime.Now.Year - user.DateOfBirth.Year - 1;
                }
            }


            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id,UserForUpdateDto userForUpdateDto)
        {
            //proveravamo da li user koji je ulogovan pokusava da pristupi ruti i odradi put
            //proveravamo id koji je prosledjen sa tokenom
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if(await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"Updating user with id: {id} failed on save");


        }

        
    }
}
